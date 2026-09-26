import { ActivityIndicator } from "react-native";

interface SpinnerProps {
	className?: string;
}

export function Spinner({ className }: SpinnerProps) {
	return <ActivityIndicator className={className} />;
}
