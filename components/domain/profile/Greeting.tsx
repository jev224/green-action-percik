import { ImageSourcePropType } from "react-native";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { UserAvatar } from "@/components/primitives/Avatar/UserAvatar";
import { Pressable } from "@/components/ui/pressable";

import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";

import {
  Icon,
  AddIcon,
  GlobeIcon,
  PlayIcon,
  SettingsIcon,
} from "@/components/ui/icon";
import { useState } from "react";
import { EaseView } from "react-native-ease";
import {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
} from "react-native-reanimated";
import {
  ProfileMenuGlideIn,
  ProfileMenuGlideOut,
} from "@/components/animation/presets";

interface GreetingProps {
  name: string;
  info?: string;
  imageSource?: ImageSourcePropType;
}

export function Greeting({ name, info, imageSource }: GreetingProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <HStack className="justify-between items-center">
      <VStack className="flex-1">
        <Heading size="xl">Halo, {name} 🖐</Heading>
        {info && <Text>{info}</Text>}
      </VStack>

      <Menu
        placement="bottom right"
        offset={5}
        className="rounded-lg p-1.5"
        disabledKeys={["Settings"]}
        onOpen={() => setMenuOpen(true)}
        onClose={() => setMenuOpen(false)}
        entering={ProfileMenuGlideIn}
        exiting={ProfileMenuGlideOut}
        trigger={({ ...triggerProps }) => {
          return (
            <Pressable {...triggerProps}>
              <EaseView
                animate={{
                  scale: isMenuOpen ? 1.1 : 1,
                  rotate: isMenuOpen ? -30 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 12,
                }}
              >
                <UserAvatar name={name} imageSource={imageSource} size="sm" />
              </EaseView>
            </Pressable>
          );
        }}
      >
        <MenuItem
          className="px-3 py-4 rounded-sm"
          key="Add account"
          textValue="Add account"
        >
          <Icon as={AddIcon} size="md" className="mr-2 " />
          <MenuItemLabel>Add account</MenuItemLabel>
        </MenuItem>
        <MenuItem
          className="px-3 py-4 rounded-sm"
          key="Community"
          textValue="Community"
        >
          <Icon as={GlobeIcon} size="md" className="mr-2 " />
          <MenuItemLabel>Community</MenuItemLabel>
        </MenuItem>
        <MenuItem
          className="px-3 py-4 rounded-sm"
          key="Plugins"
          textValue="Plugins"
        >
          <Icon as={PlayIcon} size="md" className="mr-2 " />
          <MenuItemLabel>Plugins</MenuItemLabel>
        </MenuItem>
        <MenuItem
          className="px-3 py-4 rounded-sm"
          key="Settings"
          textValue="Settings"
        >
          <Icon as={SettingsIcon} size="md" className="mr-2 " />
          <MenuItemLabel>Settings</MenuItemLabel>
        </MenuItem>
      </Menu>
    </HStack>
  );
}
