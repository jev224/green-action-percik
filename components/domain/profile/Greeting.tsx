import { LogOut } from "lucide-react-native";
import { useState } from "react";
import { type ImageSourcePropType, View } from "react-native";
import { EaseView } from "react-native-ease";
import {
	ProfileMenuGlideIn,
	ProfileMenuGlideOut,
} from "@/components/animation/presets";
import { Button, Modal } from "@/components/primitives";
import { UserAvatar } from "@/components/primitives/Avatar/UserAvatar";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon, InfoIcon, SettingsIcon } from "@/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Cloud1, Leaf4, Spark2 } from "@/constants/Assets";
import { useNavigation } from "@/hooks/useNavigation";
import { useThemeColors } from "@/hooks/useThemeColors";
import { logout } from "@/services/fetcher/account/auth";
import { randomBetween, truncateText } from "@/utils";

interface GreetingProps {
	name: string;
	info?: string;
	imageSource?: ImageSourcePropType;
}

export function Greeting({ name, info, imageSource }: GreetingProps) {
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [isMenuOpen, setMenuOpen] = useState(false);

	const handleLogout = () => {
		setIsLoggingOut(true);

		logout().finally(() => {
			setShowLogoutModal(false);
			resetTo("/(auth)/login");
		});
	};

	const { colors } = useThemeColors();
	const { resetTo, navigateTo } = useNavigation();

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
					onPress={() => navigateTo("/profile/settings")}
					className="px-3 py-4 rounded-sm"
					key="Settings"
					textValue="Pengaturan"
				>
					<Icon as={SettingsIcon} size="md" className="mr-2 " />
					<MenuItemLabel>Pengaturan</MenuItemLabel>
				</MenuItem>

				<MenuItem
					onPress={() => navigateTo("/profile/about")}
					className="px-3 py-4 rounded-sm"
					key="About"
					textValue="Tentang"
				>
					<Icon as={InfoIcon} size="md" className="mr-2 " />
					<MenuItemLabel>Tentang</MenuItemLabel>
				</MenuItem>

				<MenuItem
					onPress={() => setShowLogoutModal(true)}
					className="px-3 py-4 rounded-sm"
					key="Logout"
					textValue="Keluar"
				>
					<Icon as={LogOut} size="md" className="mr-2 text-destructive" />
					<MenuItemLabel className="text-destructive">Keluar</MenuItemLabel>
				</MenuItem>
			</Menu>

			<Modal
				isOpen={showLogoutModal}
				onClose={() => !isLoggingOut && setShowLogoutModal(false)}
				title="Mau cabut dulu? 👋"
				description="Yakin mau logout? Santuy, progress kamu aman kok"
				contentComponent={
					<>
						<Button
							isDisabled={isLoggingOut}
							label="Batalkan"
							variant="outline"
							onPress={() => setShowLogoutModal(false)}
						/>

						<Button
							isLoading={isLoggingOut}
							label="Keluar"
							variant="destructive"
							onPress={handleLogout}
						/>
					</>
				}
			/>
		</HStack>
	);
}
