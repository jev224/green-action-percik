import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Search } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchField({
  value,
  onChangeText,
  placeholder = "Cari...",
  className,
}: SearchFieldProps) {
  const { colors } = useThemeColors();

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
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.mutedForeground}
      />
    </Input>
  );
}
