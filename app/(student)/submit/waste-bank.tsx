import { Leaf, Recycle } from "lucide-react-native";
import { useState } from "react";
import { BackButton } from "@/components/domain";
import {
	BottomPanel,
	Button,
	ListSection,
	PhotoPicker,
	Screen,
	ScreenHeader,
	SegmentedControl,
	Spacer,
	TextField,
} from "@/components/primitives";

export default function WasteSubmissionScreen() {
	const [wasteType, setWasteType] = useState("organic");
	const [wasteWeight, setWasteWeight] = useState("0");

	return (
		<Screen
			scrollable
			headerComponent={
				<ScreenHeader
					title="Pengumpulan Sampah"
					leftComponent={<BackButton />}
				/>
			}
			overlayComponent={
				<BottomPanel variant="ghost">
					<Button size="cta" label="Kirim" />
				</BottomPanel>
			}
			contentComponent={
				<>
					<ListSection title="Jenis sampah">
						<SegmentedControl
							options={[
								{
									label: "Organik",
									value: "organic",
									icon: Leaf,
								},
								{
									label: "An-Organik",
									value: "anorganic",
									icon: Recycle,
								},
							]}
							value={wasteType}
							onChange={setWasteType}
						/>
					</ListSection>

					<ListSection title="Berat sampah">
						<TextField
							placeholder="Masukan Berat..."
							value={wasteWeight}
							onChangeText={setWasteWeight}
							isDecimal
							min={0}
							max={1000}
							unit="kg"
						/>
					</ListSection>

					<ListSection title="Foto bukti sampah">
						<PhotoPicker />
					</ListSection>

					<Spacer height={108} />
				</>
			}
		/>
	);
}
