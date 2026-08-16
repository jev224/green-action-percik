// components/primitives/Avatar/UserAvatar.tsx
//
// The exact same 3-line Avatar/AvatarFallbackText/AvatarImage combo was
// copy-pasted in ProfileHeader, UserAvatarHeading, and StudentList. One
// place for it now — change the fallback/image behavior once, everywhere
// updates.

import { ImageSourcePropType } from "react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import {
  Avatar as GSAvatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";

type AvatarSize = "sm" | "md" | "lg";

// Matches the 3 sizes actually used across the app: sm for list rows/
// greeting header, md/lg for the profile screen.
const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
};

interface UserAvatarProps {
  name: string;
  imageSource?: ImageSourcePropType;
  size?: AvatarSize;
  className?: string;
}

export function UserAvatar({
  name,
  imageSource,
  size = "md",
  className,
}: UserAvatarProps) {
  return (
    <GSAvatar className={cn(SIZE_CLASSES[size], className)}>
      <AvatarFallbackText>{name}</AvatarFallbackText>
      {imageSource && <AvatarImage source={imageSource} />}
    </GSAvatar>
  );
}
