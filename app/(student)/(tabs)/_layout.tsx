import {
	BarChart3,
	BookOpen,
	Home,
	House,
	User,
	UserRound,
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
					name: "learn",
					label: "Belajar",
					icon: BookOpen,
					activeIcon: BookOpen,
				},
				{
					name: "stats",
					label: "Statisik",
					icon: BarChart3,
					activeIcon: BarChart3,
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
