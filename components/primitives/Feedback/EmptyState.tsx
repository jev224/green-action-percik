import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";

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
