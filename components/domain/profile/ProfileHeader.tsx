// components/domain/profile/ProfileHeader.tsx
// Was headers/ProfileHeader.tsx. Lives in domain/profile/ since the
// student-vs-teacher subtitle logic is app-specific, not generic UI.
// Now built on the shared UserAvatar primitive instead of its own
// Avatar/AvatarFallbackText/AvatarImage markup.

import { ImageSourcePropType } from "react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { UserAvatar } from "@/components/primitives/Avatar/UserAvatar";

type ProfileRole =
  | { type: "student"; grade?: string; nis?: string }
  | { type: "teacher"; subject?: string };

interface ProfileHeaderProps {
  name: string;
  imageSource?: ImageSourcePropType;
  layout?: "centered" | "row";
  size?: "lg" | "md";
  role: ProfileRole;
}

export function ProfileHeader({
  name,
  imageSource,
  layout = "centered",
  size = "lg",
  role,
}: ProfileHeaderProps) {
  const subtitle =
    role.type === "student"
      ? role.grade
        ? `${role.grade} ∙ Siswa`
        : "Siswa"
      : role.subject
        ? `${role.subject} (Admin) ∙ Guru`
        : "Admin ∙ Guru";

  const id = role.type === "student" ? role.nis : undefined;

  return (
    <Box
      className={cn(
        "items-center",
        layout === "centered" ? "justify-center p-7" : "flex-row py-4 gap-6",
      )}
    >
      <UserAvatar
        name={name}
        imageSource={imageSource}
        size={size === "lg" ? "lg" : "md"}
      />

      <VStack
        className={layout === "centered" ? "items-center mt-2" : undefined}
      >
        <Heading size={size === "lg" ? "2xl" : "xl"}>{name}</Heading>
        <Text size="lg">{subtitle}</Text>
        {id && <Text>{id}</Text>}
      </VStack>
    </Box>
  );
}
