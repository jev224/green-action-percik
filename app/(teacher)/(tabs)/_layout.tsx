import {
	Book,
	BookOpen,
	Home,
	House,
	User,
	UserRound,
	Users,
} from "lucide-react-native";
import { NavigationTabsLayout } from "@/components/primitives";

export default function TabsLayout() {
	return (
		<NavigationTabsLayout
			tabConfigs={[
				{
					name: "home",
					label: "Rumah",
					icon: Home,
					activeIcon: House,
				},
				{
					name: "students",
					label: "Siswa",
					icon: Users,
					activeIcon: Users,
				},
				{
					name: "lessons",
					label: "Materi",
					icon: Book,
					activeIcon: BookOpen,
				},
				{
					name: "profile",
					label: "Saya",
					icon: User,
					activeIcon: UserRound,
				},
			]}
		/>
	);
}
