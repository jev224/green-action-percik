import { Download } from "lucide-react-native";
import { useMemo } from "react";
import { ProfileHeader, ProfileList } from "@/components/domain";
import { Screen } from "@/components/primitives";
import { Box } from "@/components/ui/box";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";

import { useNavigation } from "@/hooks/useNavigation";
import { useUserProfile } from "@/hooks/useUser";
import { parseProfileInfo } from "@/utils";

export default function ProfileScreen() {
	const { navigateTo } = useNavigation();

	const { profile, isLoading, isError, revalidate } = useUserProfile("teacher");

	const profileItems = useMemo(
		() => [
			{
				key: "download",
				label: "Download",
				icon: Download,
				onPress: () => navigateTo("/(teacher)/export-data"),
			},
		],
		[navigateTo],
	);

	return (
		<Screen
			isLoading={isLoading}
			isError={isError}
			data={profile}
			onTryAgain={revalidate}
			requiredInternet
			contentComponent={({ name, major, photoUrl }) => (
				<>
					<ProfileHeader
						name={name}
						role={{
							type: "teacher",
							info: parseProfileInfo({ role: "teacher", major }),
						}}
						imageSource={{ uri: photoUrl }}
					/>

					<ProfileList items={profileItems} />
				</>
			)}
			loadingComponent={
				<>
					<Box className="p-7 gap-4 items-center">
						<Skeleton className="aspect-square w-32 h-32 rounded-full" />
						<VStack space="sm" className="items-center">
							<SkeletonText className="w-64 h-6" />
							<SkeletonText className="w-32 h-4 opacity-60" />
						</VStack>
					</Box>

					<ProfileList items={profileItems} />
				</>
			}
		/>
	);
}
