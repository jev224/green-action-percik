import { useState } from "react";
import { BackButton } from "@/components/domain";
import {
	Button,
	ListSection,
	PhotoPicker,
	Screen,
	ScreenHeader,
	SelectField,
	TextField,
} from "@/components/primitives";
import { refreshOnNextNavigate } from "@/hooks/useRefreshOnNavigate";

const CLASS_OPTIONS = [
	{ label: "10-A", value: "10-A" },
	{ label: "10-B", value: "10-B" },
	{ label: "10-C", value: "10-C" },
	{ label: "11-A", value: "11-A" },
	{ label: "11-B", value: "11-B" },
];

export default function EditStudentProfileScreen() {
	const [name, setName] = useState("Ahmad");
	const [nis, setNis] = useState("20240021");
	const [className, setClassName] = useState("10-A");
	const [avatar, setAvatar] = useState<string | null>(null);

	const handleSave = () => {
		// update student
		refreshOnNextNavigate();
	};

	return (
		<Screen
			scrollable
			headerComponent={
				<ScreenHeader
					title="Edit Profil Siswa"
					leftComponent={<BackButton />}
				/>
			}
			contentComponent={
				<>
					{/* Profile photo */}
					<ListSection title="Foto profil siswa">
						<PhotoPicker value={avatar} onChange={setAvatar} />
					</ListSection>

					{/* Basic information */}
					<ListSection title="Informasi siswa">
						<TextField
							value={name}
							onChangeText={setName}
							placeholder="masukkan nama siswa"
						/>

						<TextField
							value={nis}
							onChangeText={setNis}
							placeholder="masukkan nis"
							keyboardType="numeric"
						/>

						<SelectField
							value={className}
							options={CLASS_OPTIONS}
							onValueChange={setClassName}
							placeholder="pilih kelas"
						/>
					</ListSection>

					{/* Save */}
					<Button
						label="Simpan perubahan"
						onPress={handleSave}
						className="mt-4"
					/>
				</>
			}
		/>
	);
}
