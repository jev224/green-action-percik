import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { SurfaceCard } from "./SurfaceCard";
import {
  SemanticColor,
  SurfaceVariant,
} from "@/components/styles/buildColorsVariants";

interface QuoteCardProps {
  quote: string;
  author?: string;
  color?: SemanticColor;
  variant?: SurfaceVariant;
}

export function QuoteCard({ quote, author, color, variant }: QuoteCardProps) {
  return (
    <SurfaceCard
      color={color}
      variant={variant}
      className="p-6 bg-primary flex-row"
    >
      {(styles) => (
        <>
          <VStack className="flex-1" space="md">
            <Heading
              className={styles.text({ className: "w-[70%]" })}
              size="xl"
            >
              {quote}
            </Heading>

            {author && (
              <Text className={styles.text({ className: "w-[70%]" })} size="lg">
                ~ {author}
              </Text>
            )}
          </VStack>
        </>
      )}
    </SurfaceCard>
  );
}
