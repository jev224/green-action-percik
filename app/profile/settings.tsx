import { SunMoon } from "lucide-react-native";
import { BackButton } from "@/components/domain";
import {
	List,
	Screen,
	ScreenHeader,
	SelectField,
} from "@/components/primitives";
import { type Settings, useSettings } from "@/hooks/useSettings";

export default function ChangePasswordScreen() {
	const { settings, set } = useSettings();

	return (
		<Screen
			headerComponent={
				<ScreenHeader title="Pengaturan" leftComponent={<BackButton />} />
			}
			contentComponent={
				<List
					items={[
						{
							key: "dark-toggle",
							label: "Tema",
							icon: SunMoon,
							trailing: (
								<SelectField
									options={[
										{ label: "Terang", value: "light" },
										{ label: "Gelap", value: "dark" },
										{ label: "Sistem", value: "system" },
									]}
									value={settings.theme}
									onValueChange={(value) =>
										set("theme", value as Settings["theme"])
									}
									inList
								/>
							),
						},
					]}
				/>
			}
		/>
	);
}
