// components/primitives/Feedback/ProgressBar.tsx
// Was display/ProgressBar.tsx. Already clean — moved as-is.

import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";

interface ProgressBarProps {
  text?: string;
  value: number;
}

export function ProgressBar({ text, value }: ProgressBarProps) {
  return (
    <VStack className="gap-2">
      {text && (
        <Text size="md" className="opacity-70">
          {text}
        </Text>
      )}

      <Progress value={value} className="h-2.5">
        <ProgressFilledTrack className="rounded-full" />
      </Progress>
    </VStack>
  );
}
