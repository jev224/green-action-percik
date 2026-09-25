import { Redirect } from "expo-router";
import { useEffect } from "react";
import { BackButton } from "@/components/domain";
import {
	BottomPanel,
	Button,
	ListSection,
	Screen,
	ScreenHeader,
	Spacer,
	SurfaceCard,
} from "@/components/primitives";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useAsyncData } from "@/hooks/useAsyncData";
import { useNavigation } from "@/hooks/useNavigation";
import { useShowToast } from "@/hooks/useShowToast";
import { fetchLesson } from "@/services/fetcher/lesson/lessonQuery";
import { useLessonStore } from "@/stores/lesson";
import { formatDate } from "@/utils";

export default function LessonOverviewScreen() {
	const { navigateTo } = useNavigation();
	const showToast = useShowToast();

	const lesson = useLessonStore((state) => state.lesson);

	const setLessonContentData = useLessonStore(
		(state) => state.setLessonContentData,
	);

	const { data, isLoading, isError, errorMessage, refresh } = useAsyncData(
		async () => {
			if (lesson.mode !== "view") return null;
			return await fetchLesson(lesson.id);
		},
	);

	useEffect(() => {
		if (!isLoading && !data) {
			showToast({ title: "Data materi tidak ditemukan" });
		}
	}, [isLoading, data]);

	if (!isLoading && !data) {
		return <Redirect href={"/(teacher)/(tabs)/students"} />;
	}

	const handleReadLesson = () => {
		if (!data) return;

		setLessonContentData(data.id, data.title, data.contents);
		navigateTo("/(student)/learn/content");
	};

	return (
		<Screen
			scrollable
			isLoading={isLoading}
			isError={isError}
			data={data}
			errorMessage={errorMessage}
			onTryAgain={refresh}
			requiredInternet
			headerComponent={
				<ScreenHeader title="Detail Materi" leftComponent={<BackButton />} />
			}
			overlayComponent={
				<BottomPanel>
					<Button
						size="cta"
						label="Baca Materi"
						onPress={handleReadLesson}
						isDisabled={isLoading}
					/>
				</BottomPanel>
			}
			contentComponent={({
				title,
				description,
				author,
				contents,
				photoUrl,
				created_at,
			}) => (
				<>
					{photoUrl && (
						<Box className="w-full h-52 bg-accent-foreground/20 rounded-md overflow-hidden">
							<Image
								className="w-full h-full"
								resizeMode="cover"
								source={photoUrl}
							/>
						</Box>
					)}

					<VStack space="xs">
						<Heading size={photoUrl ? "xl" : "2xl"}>{title}</Heading>

						<Text size="sm" className="opacity-70">
							{"Dibuat oleh "}
							<Text className="font-bold" size="sm">
								{author}
							</Text>
							{` · ${formatDate(created_at)}`}
						</Text>
					</VStack>

					<ListSection size="sm" space="xs" title="Deskripsi">
						<Text size="md" className="leading-6">
							{description}
						</Text>
					</ListSection>

					<ListSection size="md" space="sm" title="Konten:">
						<VStack space="sm">
							{contents.map(({ id, title }, index) => (
								<SurfaceCard className="items-start px-6 rounded-md" key={id}>
									{() => (
										<HStack className="items-center" space="xs">
											<Text className="font-medium">{index + 1}.</Text>
											<Text>{title}</Text>
										</HStack>
									)}
								</SurfaceCard>
							))}
						</VStack>
					</ListSection>

					<Spacer height={108} />
				</>
			)}
		/>
	);
}
