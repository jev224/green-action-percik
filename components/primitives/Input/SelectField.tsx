import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { useState } from "react";
import { Platform } from "react-native";
import { ChevronDownIcon } from "@/components/ui/icon";
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectInput,
	SelectItem,
	SelectPortal,
	SelectTrigger,
} from "@/components/ui/select";
import { truncateText } from "@/utils";
import { SmoothActionSheet } from "../Layout/SmoothActionSheet";

const BROWSER_RESET_STYLE = {
	outlineWidth: 0,
	boxShadow: "none",
	WebkitTapHighlightColor: "transparent",
	cursor: "pointer",
	userSelect: "none",
} as const;

interface SelectOption {
	label: string;
	value: string;
}

interface SelectFieldProps {
	options: SelectOption[];
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	className?: string;
	inList?: boolean;
}

export function SelectField({
	options,
	value,
	onValueChange,
	placeholder = "Silahkan Pilih",
	className,
	inList,
}: SelectFieldProps) {
	const [isOpen, setIsOpen] = useState(false);

	const initialValue = options.find((o) => o.value === value)?.label;

	return (
		<Select
			selectedValue={value}
			initialLabel={initialValue}
			onValueChange={onValueChange}
			onClose={() => setIsOpen(false)}
		>
			<SelectTrigger
				className={cn(
					"rounded-md justify-between py-4",
					inList &&
						"p-0 -mr-4 gap-2.5 border-0 ring-0 w-fit" +
							"data-[focus=true]:border-0 data-[focus=true]:ring-0 " +
							"data-[hover=true]:border-0 data-[active=true]:border-0",
					className,
				)}
				style={inList ? BROWSER_RESET_STYLE : undefined}
				variant="outline"
				size="lg"
				onPress={() => setIsOpen(true)}
			>
				<SelectInput
					className={cn("ml-3 font-medium", inList && "pr-0 text-right")}
					placeholder={inList ? truncateText(placeholder, 16) : placeholder}
				/>

				<SelectIcon className="mr-3" as={ChevronDownIcon} />
			</SelectTrigger>

			{Platform.OS === "web" ? (
				<SelectPortal>
					<SelectContent>
						{options.map((opt) => (
							<SelectItem
								className="py-4 bg-amber-400"
								key={opt.value}
								label={inList ? truncateText(opt.label, 16) : opt.label}
								value={opt.value}
							/>
						))}
					</SelectContent>
				</SelectPortal>
			) : (
				<SmoothActionSheet
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					selectPortal
				>
					{options.map((opt) => (
						<SelectItem
							className="py-4 bg-amber-400"
							key={opt.value}
							label={inList ? truncateText(opt.label, 16) : opt.label}
							value={opt.value}
						/>
					))}
				</SmoothActionSheet>
			)}
		</Select>
	);
}
