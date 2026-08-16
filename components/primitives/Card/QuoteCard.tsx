// components/primitives/Card/QuoteCard.tsx
//
// This one was already fine — single surface, no variant matrix needed.
// Moved as-is, just relocated next to the other cards.

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface QuoteCardProps {
  quote: string;
  author?: string;
}

export function QuoteCard({ quote, author }: QuoteCardProps) {
  return (
    <Card className="p-6 bg-primary flex-row" size="default">
      <VStack className="flex-1" space="md">
        <Heading className="text-primary-foreground w-[70%]" size="xl">
          {quote}
        </Heading>

        {author && (
          <Text className="text-primary-foreground" size="lg">
            ~ {author}
          </Text>
        )}
      </VStack>
    </Card>
  );
}
