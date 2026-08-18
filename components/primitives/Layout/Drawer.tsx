import { ComponentProps, ReactNode, useEffect } from "react";
import { useAnimatedStyle, withTiming } from "react-native-reanimated";

import {
  Drawer as GSDrawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer";
import { DrawerIn, DrawerOut } from "@/components/animation/presets";
import { Box } from "@/components/ui/box";

import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";
import { Keyboard } from "react-native";

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

  const animatedBodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(isOpen ? -keyboard.height / 2 : 0) }],
  }));

  useEffect(() => {
    if (!isOpen) Keyboard.dismiss();
  }, [isOpen]);

  return (
    <GSDrawer isOpen={isOpen} anchor={anchor} {...props}>
      <DrawerBackdrop />

      <DrawerContent
        className="bg-transparent border-0"
        entering={DrawerIn.direction(anchor)}
        exiting={DrawerOut.direction(anchor)}
        style={animatedBodyStyle}
      >
        <Box className="absolute inset-0 -bottom-20 rounded-xl bg-background" />

        <Box
          className="absolute inset-0 z-30"
          style={{ pointerEvents: isOpen ? "none" : "box-only" }}
        />

        {headerComponenent && <DrawerHeader>{headerComponenent}</DrawerHeader>}

        <DrawerBody keyboardDismissMode="interactive">
          {contentComponent}
        </DrawerBody>

        {footerComponent && (
          <DrawerFooter className="mb-4">{footerComponent}</DrawerFooter>
        )}
      </DrawerContent>
    </GSDrawer>
  );
};

export { Drawer };
