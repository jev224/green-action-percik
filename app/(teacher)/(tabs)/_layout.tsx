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
					label: "Home",
					icon: Home,
					activeIcon: House,
				},
				{
					name: "students",
					label: "Students",
					icon: Users,
					activeIcon: Users,
				},
				{
					name: "lessons",
					label: "Lessons",
					icon: Book,
					activeIcon: BookOpen,
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
