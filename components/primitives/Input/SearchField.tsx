import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks/useDebounced";
import { useThemeColors } from "@/hooks/useThemeColors";

interface SearchFieldProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	className?: string;
	debounceMs?: number;
}

export function SearchField({
	value,
	onChangeText,
	placeholder = "Cari...",
	className,
	debounceMs = 300,
}: SearchFieldProps) {
	const { colors } = useThemeColors();
	const [localValue, setLocalValue] = useState(value);

	const debouncedChange = useDebouncedCallback(onChangeText, debounceMs);

	// Sync local state if the parent changes `value` externally (e.g. a reset)
	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const handleChange = (text: string) => {
		setLocalValue(text);
		debouncedChange(text);
	};

	return (
		<Input
			className={cn(
				"flex-1 pl-3 py-3 border-2 rounded-lg shadow-none",
				className,
			)}
		>
			<InputSlot>
				<InputIcon className="text-foreground/80 w-6 h-6 mr-1" as={Search} />
			</InputSlot>

			<InputField
				className="font-medium"
				placeholder={placeholder}
				value={localValue}
				onChangeText={handleChange}
				placeholderTextColor={colors.mutedForeground}
			/>
		</Input>
	);
}
