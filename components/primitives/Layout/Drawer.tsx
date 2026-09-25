import { type ComponentProps, type ReactNode, useEffect } from "react";
import { Keyboard } from "react-native";
import { EaseView } from "react-native-ease";
import { DrawerIn, DrawerOut } from "@/components/animation/presets";
import { Box } from "@/components/ui/box";
import {
	DrawerBackdrop,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	Drawer as GSDrawer,
} from "@/components/ui/drawer";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";

type DrawerProps = {
	headerComponenent?: ReactNode;
	contentComponent: ReactNode;
	footerComponent?: ReactNode;
	avoidKeyboard?: boolean;
} & ComponentProps<typeof GSDrawer>;

const Drawer = ({
	headerComponenent,
	contentComponent,
	footerComponent,
	anchor,
	isOpen,
	avoidKeyboard,
	...props
}: DrawerProps) => {
	const keyboard = useKeyboardHeight();

	useEffect(() => {
		if (!isOpen) Keyboard.dismiss();
	}, [isOpen]);

	return (
		<GSDrawer isOpen={isOpen} anchor={anchor} {...props}>
			<DrawerBackdrop />

			<EaseView
				style={{
					flex: 1,
					justifyContent: "flex-end",
					alignItems: "center",
				}}
				animate={{ translateY: -keyboard.height / 2 }}
				transition={{ type: "spring", damping: 32, stiffness: 320, mass: 1 }}
			>
				<DrawerContent
					className="bg-transparent border-0 relative max-w-180"
					entering={DrawerIn.direction(anchor)}
					exiting={DrawerOut.direction(anchor)}
				>
					<Box className="absolute inset-0 -bottom-full rounded-xl bg-background" />

					<Box
						className="absolute inset-0 z-30"
						style={{ pointerEvents: isOpen ? "none" : "box-only" }}
					/>

					{headerComponenent && (
						<DrawerHeader>{headerComponenent}</DrawerHeader>
					)}

					<DrawerBody keyboardDismissMode="interactive">
						{contentComponent}
					</DrawerBody>

					{footerComponent && (
						<DrawerFooter className="mb-4">{footerComponent}</DrawerFooter>
					)}
				</DrawerContent>
			</EaseView>
		</GSDrawer>
	);
};

export { Drawer };
