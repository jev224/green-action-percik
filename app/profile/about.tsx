import { BackButton } from "@/components/domain";
import { Screen, ScreenHeader } from "@/components/primitives";
import { Text } from "@/components/ui/text";

export default function AboutScreen() {
	return (
		<Screen
			headerComponent={
				<ScreenHeader title="Tentang" leftComponent={<BackButton />} />
			}
			contentComponent={
				<Text>
					Platform edukasi pengolahan sampah untuk menciptakan lingkungan
					sekolah yang bersih, hijau, sehat, dan berkelanjutan.
				</Text>
			}
		/>
	);
}
