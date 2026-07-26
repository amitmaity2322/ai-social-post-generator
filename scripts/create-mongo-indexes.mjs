// One-time setup script - MongoDB has no migration runner, so this is the
// equivalent of the old Postgres migrations for the indexes that matter.
//
// Run once against your database: node --env-file=.env.local scripts/create-mongo-indexes.mjs
//
// The users.email index is not optional polish: registerUser's "check email,
// then insert" is a check-then-act race without a real unique constraint
// backing it - two concurrent signups with the same email could otherwise
// both succeed.
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Set MONGODB_URI before running this script.");
  process.exit(1);
}

const client = new MongoClient(uri);

async function main() {
  await client.connect();
  const db = client.db();

  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  console.log("Created unique index: users.email");

  await db.collection("savedPosts").createIndex({ userId: 1, createdAt: -1 });
  console.log("Created index: savedPosts.userId + createdAt");
}

main()
  .then(() => client.close())
  .catch((error) => {
    console.error(error);
    return client.close();
  })
  .finally(() => process.exit());
