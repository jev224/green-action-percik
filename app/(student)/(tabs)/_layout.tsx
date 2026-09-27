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
					label: "Home",
					icon: Home,
					activeIcon: House,
				},
				{
					name: "learn",
					label: "Learn",
					icon: BookOpen,
					activeIcon: BookOpen,
				},
				{
					name: "stats",
					label: "Stats",
					icon: BarChart3,
					activeIcon: BarChart3,
				},
				{
					name: "profile",
					label: "Me",
					icon: User,
					activeIcon: UserRound,
				},
			]}
		/>
	);
}
