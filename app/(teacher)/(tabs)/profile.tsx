import { Download } from "lucide-react-native";
import { useMemo } from "react";
import { ProfileHeader, ProfileList } from "@/components/domain";
import { Screen } from "@/components/primitives";
import { Box } from "@/components/ui/box";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { useAsyncData } from "@/hooks/useAsyncData";

import { useNavigation } from "@/hooks/useNavigation";
import { getTeacherProfile } from "@/services/teacher/profile";

import { parseProfileInfo } from "@/utils";

export default function ProfileScreen() {
	const { navigateTo } = useNavigation();

	const { data, isLoading, isError } = useAsyncData(getTeacherProfile, []);

	const profileItems = useMemo(
		() => [
			{
				key: "download",
				label: "Download",
				icon: Download,
				onPress: () => navigateTo("/(teacher)/download"),
			},
		],
		[navigateTo],
	);

	return (
		<Screen
			isLoading={isLoading}
			isError={isError}
			data={data}
			contentComponent={({ name, major }) => (
				<>
					<ProfileHeader
						name={name}
						role={{
							type: "teacher",
							info: parseProfileInfo({ role: "teacher", major }),
						}}
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
