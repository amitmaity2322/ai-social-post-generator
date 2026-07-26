import styles from "./Avatar.module.css";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarPerson {
  fullName?: string | null;
  email?: string | null;
}

interface AvatarProps {
  person: AvatarPerson;
  size?: AvatarSize;
  className?: string;
}

export function getInitials({ fullName, email }: AvatarPerson): string {
  const source = fullName?.trim() || email?.trim() || "?";
  const parts = source.split(/\s+/);
  const initials = parts.length > 1 ? `${parts[0]![0]}${parts[1]![0]}` : source.slice(0, 2);
  return initials.toUpperCase();
}

export function Avatar({ person, size = "md", className }: AvatarProps) {
  return (
    <span className={[styles.avatar, styles[size], className].filter(Boolean).join(" ")}>
      {getInitials(person)}
    </span>
  );
}
