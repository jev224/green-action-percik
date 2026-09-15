import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { useState } from "react";
import { ChevronDownIcon } from "@/components/ui/icon";
import {
	Select,
	SelectIcon,
	SelectInput,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { truncateText } from "@/utils";
import { SmoothSelectPortal } from "./SmoothSelectPortal";

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
	placeholder = "Select option",
	className,
	inList,
}: SelectFieldProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Select
			selectedValue={value}
			onValueChange={onValueChange}
			onClose={() => setIsOpen(false)}
		>
			<SelectTrigger
				className={cn(
					"rounded-md justify-between py-4",
					inList && "p-0 -mr-4 gap-2.5 border-0",
					className,
				)}
				variant="outline"
				size="lg"
				onPress={() => setIsOpen(true)}
			>
				<SelectInput
					className={cn("ml-3 font-medium", inList && "pr-0")}
					placeholder={inList ? truncateText(placeholder, 16) : placeholder}
				/>
				<SelectIcon className="mr-3" as={ChevronDownIcon} />
			</SelectTrigger>

			<SmoothSelectPortal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				{options.map((opt) => (
					<SelectItem
						className="py-4"
						key={opt.value}
						label={inList ? truncateText(opt.label, 16) : opt.label}
						value={opt.value}
					/>
				))}
			</SmoothSelectPortal>
		</Select>
	);
}
