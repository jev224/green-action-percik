import { Check } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { EaseView } from "react-native-ease";
import { cnBase } from "tailwind-variants";
import { EaseTranstionConfig } from "@/components/animation/presets";
import { Text } from "@/components/ui/text";
import { usePressFeedback } from "@/hooks/usePressFeedback";
import { useThemeColors } from "@/hooks/useThemeColors";

interface CheckboxProps {
	className?: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	disabled?: boolean;
	invalid?: boolean;
	size?: number;
	label?: string;
}

export function Checkbox({
	className,
	checked,
	onCheckedChange,
	disabled = false,
	invalid = false,
	size = 24,
	label = "THis is label",
}: CheckboxProps) {
	const { colors } = useThemeColors();
	const { bind, scaleAnimation } = usePressFeedback(1.2);

	const resolvedChecked = !disabled && checked;

	return (
		<Pressable
			accessible
			accessibilityRole="checkbox"
			accessibilityState={{ checked, disabled }}
			disabled={disabled}
			onPress={() => onCheckedChange(!checked)}
			className={cnBase(
				`flex-row gap-2 items-center self-start rounded-xs      
                 web:focus-visible:outline-none 
                 web:focus-visible:ring-3   
                 web:focus-visible:ring-ring/50 
                 web:focus-visible:border-2   
                 web:focus-visible:border-primary 
                 web:focus-visible:p-2 
                 web:focus-visible:pr-3  
                 web:focus-visible:m-0! `,
				className,
			)}
			style={{ opacity: disabled ? 0.4 : 1 }}
			{...bind}
		>
			<EaseView
				animate={{ scale: scaleAnimation.scale }}
				transition={{ type: "spring", ...EaseTranstionConfig.spring.glide }}
			>
				<View
					className="relative items-center justify-center shrink-0 overflow-hidden shadow-xs dark:bg-input/30"
					style={{
						width: size,
						height: size,
						borderRadius: 8,
					}}
				>
					{/* Animated background */}
					<EaseView
						style={{
							position: "absolute",
							inset: 0,
							borderWidth: 2,
							borderRadius: 8,
						}}
						animate={{
							borderColor: invalid
								? colors.destructive
								: resolvedChecked
									? colors.primary
									: colors.input,
							backgroundColor: resolvedChecked ? colors.primary : "transparent",
						}}
						transition={{
							border: { type: "timing", duration: 100 },
							backgroundColor: { type: "timing", duration: 200 },
						}}
					/>

					{/* Checkmark */}
					<EaseView
						animate={{
							scale: checked ? 1 : 0,
						}}
						transition={{
							type: "spring",
							...EaseTranstionConfig.spring.glide,
						}}
					>
						<Check
							size={size * 0.65}
							color={colors.primaryForeground}
							strokeWidth={4}
						/>
					</EaseView>
				</View>
			</EaseView>

			{label && (
				<Text size="sm" className="font-medium">
					{label}
				</Text>
			)}
		</Pressable>
	);
}
