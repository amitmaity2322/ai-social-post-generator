import bcrypt from "bcryptjs";
import type { Db, WithId } from "mongodb";
import { ObjectId } from "mongodb";
import type {
  UserRepositoryPort,
  CreateUserParams,
  BrandKitInput,
} from "@/domain/ports/UserRepositoryPort";
import type { User } from "@/domain/entities/User";
import type { Tone } from "@/domain/value-objects/Tone";
import type { Platform } from "@/domain/value-objects/Platform";
import { NotFoundError } from "@/domain/errors/NotFoundError";
import { TRIAL_DAYS, type SubscriptionPlan } from "@/shared/constants/plans";

const SALT_ROUNDS = 12;
const DEFAULT_PLAN: SubscriptionPlan = "free";
const DEFAULT_TONE: Tone = "professional";
const DEFAULT_BRAND_COLOR = "#6d28d9";
const TRIAL_DURATION_MS = TRIAL_DAYS * 24 * 60 * 60 * 1000;

interface UserDocument {
  email: string;
  name?: string;
  passwordHash: string;
  emailVerified: Date | null;
  createdAt: Date;
  /** Optional so pre-existing documents created before plans existed still parse - they default to free. */
  plan?: SubscriptionPlan;
  /** Optional for the same reason - pre-existing documents default to "professional". */
  defaultTone?: Tone;
  brandVoice?: string;
  brandColor?: string;
  logoUrl?: string;
  connectedPlatforms?: Platform[];
  /** Optional so accounts created before trials existed parse as having no trial. */
  trialEndsAt?: Date | null;
}

function toUser(doc: WithId<UserDocument>): User {
  return {
    id: doc._id.toString(),
    email: doc.email,
    fullName: doc.name ?? null,
    plan: doc.plan ?? DEFAULT_PLAN,
    defaultTone: doc.defaultTone ?? DEFAULT_TONE,
    brandVoice: doc.brandVoice ?? "",
    brandColor: doc.brandColor ?? DEFAULT_BRAND_COLOR,
    logoUrl: doc.logoUrl ?? "",
    connectedPlatforms: doc.connectedPlatforms ?? [],
    createdAt: doc.createdAt.toISOString(),
    trialEndsAt: doc.trialEndsAt ? doc.trialEndsAt.toISOString() : null,
  };
}

export class MongoUserRepository implements UserRepositoryPort {
  constructor(private readonly db: Db) {}

  private get collection() {
    return this.db.collection<UserDocument>("users");
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.collection.findOne({ email });
    return doc ? toUser(doc) : null;
  }

  async create({ email, password, fullName }: CreateUserParams): Promise<User> {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const createdAt = new Date();
    const trialEndsAt = new Date(createdAt.getTime() + TRIAL_DURATION_MS);

    const { insertedId } = await this.collection.insertOne({
      email,
      name: fullName,
      passwordHash,
      emailVerified: null,
      createdAt,
      plan: DEFAULT_PLAN,
      defaultTone: DEFAULT_TONE,
      brandVoice: "",
      brandColor: DEFAULT_BRAND_COLOR,
      logoUrl: "",
      connectedPlatforms: [],
      trialEndsAt,
    });

    return {
      id: insertedId.toString(),
      email,
      fullName,
      plan: DEFAULT_PLAN,
      defaultTone: DEFAULT_TONE,
      brandVoice: "",
      brandColor: DEFAULT_BRAND_COLOR,
      logoUrl: "",
      connectedPlatforms: [],
      createdAt: createdAt.toISOString(),
      trialEndsAt: trialEndsAt.toISOString(),
    };
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const doc = await this.collection.findOne({ email });
    if (!doc) return null;

    const isValid = await bcrypt.compare(password, doc.passwordHash);
    return isValid ? toUser(doc) : null;
  }

  /**
   * Choosing Free (re)starts a fresh 15-day trial - Free is the only plan a trial ever attaches
   * to. Choosing Pro or Business (always via the paid checkout flow) ends any trial immediately
   * and grants that plan's features with no trial period.
   */
  async updatePlan(userId: string, plan: SubscriptionPlan): Promise<User> {
    if (!ObjectId.isValid(userId)) throw new NotFoundError("User not found");

    const trialEndsAt = plan === "free" ? new Date(Date.now() + TRIAL_DURATION_MS) : null;
    const doc = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { plan, trialEndsAt } },
      { returnDocument: "after" },
    );

    if (!doc) throw new NotFoundError("User not found");
    return toUser(doc);
  }

  async updateDefaultTone(userId: string, tone: Tone): Promise<User> {
    if (!ObjectId.isValid(userId)) throw new NotFoundError("User not found");

    const doc = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { defaultTone: tone } },
      { returnDocument: "after" },
    );

    if (!doc) throw new NotFoundError("User not found");
    return toUser(doc);
  }

  async updateBrandKit(userId: string, brandKit: BrandKitInput): Promise<User> {
    if (!ObjectId.isValid(userId)) throw new NotFoundError("User not found");

    const doc = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: brandKit },
      { returnDocument: "after" },
    );

    if (!doc) throw new NotFoundError("User not found");
    return toUser(doc);
  }

  async updateConnectedPlatforms(userId: string, platforms: Platform[]): Promise<User> {
    if (!ObjectId.isValid(userId)) throw new NotFoundError("User not found");

    const doc = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { connectedPlatforms: platforms } },
      { returnDocument: "after" },
    );

    if (!doc) throw new NotFoundError("User not found");
    return toUser(doc);
  }
}
