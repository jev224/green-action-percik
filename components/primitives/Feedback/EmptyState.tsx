// components/primitives/Feedback/EmptyState.tsx
// Was display/NotFound.tsx. Renamed — "NotFound" reads like a 404 route,
// but this is used as an empty-state placeholder (no students match this
// filter, no modules yet, etc). "EmptyState" says what it's for.
//
// Also swapped the hardcoded text-gray-400 for text-muted-foreground so it
// actually respects light/dark theme like everything else.

import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <Center className="items-center py-10">
      <Text className="text-muted-foreground">{message}</Text>
    </Center>
  );
}
