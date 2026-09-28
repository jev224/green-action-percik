import { FileQuestionMark } from "lucide-react-native";
import ErrorState from "@/components/primitives/Feedback/ErrorState";
import { Center } from "@/components/ui/center";
import { useNavigation } from "@/hooks/useNavigation";

export default function NotFoundScreen() {
	const { goBack, getHomeRoute } = useNavigation();
	return (
		<Center className="flex-1 bg-background">
			<ErrorState
				icon={FileQuestionMark}
				title="Halaman tidak ditemukan"
				message="Halaman yang kamu cari tidak tersedia atau mungkin sudah dipindahkan."
				buttonLabel="Kembali"
				onRetry={() => {
					goBack(getHomeRoute());
				}}
			/>
		</Center>
	);
}
