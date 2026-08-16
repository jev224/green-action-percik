// components/domain/profile/Greeting.tsx
// Was headers/UserAvatarHeading.tsx. Renamed — "Greeting" describes what
// it does ("Halo, Name 👋"), where "UserAvatarHeading" was ambiguous
// against the also-avatar-based ProfileHeader right next to it. Now built
// on the same UserAvatar primitive ProfileHeader and StudentListItem use.

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

interface GreetingProps {
  name: string;
  info?: string;
  imageSource?: ImageSourcePropType;
}

export function Greeting({ name, info, imageSource }: GreetingProps) {
  return (
    <HStack className="justify-between items-center">
      <VStack className="flex-1">
        <Heading size="xl">Halo, {name} 🖐</Heading>
        {info && <Text>{info}</Text>}
      </VStack>

      <Menu
        placement="bottom right"
        offset={5}
        disabledKeys={["Settings"]}
        trigger={({ ...triggerProps }) => {
          console.log(triggerProps);
          return (
            <Pressable {...triggerProps}>
              <UserAvatar name={name} imageSource={imageSource} size="sm" />
            </Pressable>
          );
        }}
      >
        <MenuItem key="Add account" textValue="Add account">
          <Icon as={AddIcon} size="sm" className="mr-2 " />
          <MenuItemLabel size="sm">Add account</MenuItemLabel>
        </MenuItem>
        <MenuItem key="Community" textValue="Community">
          <Icon as={GlobeIcon} size="sm" className="mr-2 " />
          <MenuItemLabel size="sm">Community</MenuItemLabel>
        </MenuItem>
        <MenuItem key="Plugins" textValue="Plugins">
          <Icon as={PlayIcon} size="sm" className="mr-2 " />
          <MenuItemLabel size="sm">Plugins</MenuItemLabel>
        </MenuItem>
        <MenuItem key="Settings" textValue="Settings">
          <Icon as={SettingsIcon} size="sm" className="mr-2 " />
          <MenuItemLabel size="sm">Settings</MenuItemLabel>
        </MenuItem>
      </Menu>
    </HStack>
  );
}
