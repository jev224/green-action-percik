import { ProfileHeader, ProfileList } from "@/components/domain";
import { Screen } from "@/components/primitives";
import { Box } from "@/components/ui/box";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";

import { useAsyncData } from "@/hooks/useAsyncData";

import { getStudentProfile } from "@/services/student/profile";
import { parseProfileInfo } from "@/utils";

export default function ProfileScreen() {
	const { data, isLoading, isError } = useAsyncData(getStudentProfile, []);

	return (
		<Screen
			isLoading={isLoading}
			isError={isError}
			data={data}
			contentComponent={({ name, class: classData, nis }) => (
				<>
					<ProfileHeader
						name={name}
						role={{
							type: "student",
							info: parseProfileInfo({ role: "student", ...classData }),
							nis,
						}}
					/>

					<ProfileList />
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

					<ProfileList />
				</>
			}
		/>
	);
}
