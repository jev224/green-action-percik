import { ImageSourcePropType, View } from "react-native";
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
  ProfileMenuGlideIn,
  ProfileMenuGlideOut,
} from "@/components/animation/presets";
import { randomBetween, truncateText } from "@/utils";
import { Cloud1, Leaf4, Leaf5, Spark1, Spark2 } from "@/constants/Assets";
import { useThemeColors } from "@/hooks/useThemeColors";

interface GreetingProps {
  name: string;
  info?: string;
  imageSource?: ImageSourcePropType;
}

export function Greeting({ name, info, imageSource }: GreetingProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const { colors } = useThemeColors();

  return (
    <HStack className="justify-between items-center">
      <VStack className="flex-1">
        <Heading size="xl">Halo, {truncateText(name, 12)} 🖐</Heading>
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
              <View className="absolute inset-0">
                <View className="absolute -bottom-1 -left-4">
                  <Cloud1
                    color={colors.accentForeground}
                    width={22}
                    height={22}
                    opacity={0.15}
                  />
                </View>

                <View className="absolute -bottom-1 -right-5 -rotate-12">
                  <Cloud1
                    color={colors.accentForeground}
                    width={32}
                    height={32}
                    opacity={0.1}
                  />
                </View>

                <View className="absolute -top-2 -left-2 -rotate-48">
                  <Spark2
                    color={colors.warning}
                    width={18}
                    height={18}
                    opacity={0.5}
                  />
                </View>
              </View>

              <EaseView
                animate={{
                  scale: isMenuOpen ? 1.1 : 1,
                  rotate: isMenuOpen ? randomBetween(-40, 40) : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 12,
                }}
              >
                <UserAvatar name={name} imageSource={imageSource} size="sm" />

                <View className="absolute -top-2 -right-1 rotate-48">
                  <Leaf4 color={colors.destructive} width={28} height={28} />
                </View>
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
