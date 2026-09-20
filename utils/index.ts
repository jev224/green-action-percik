import NetInfo from "@react-native-community/netinfo";

export const sumReduceFn = (sum: number, curr: number) => sum + curr;

export function getCurrentMonthDateRange() {
	const now = new Date();

	const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

	const end = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

	return {
		start,
		end,
	};
}

export function getDayRange(date: Date = new Date()) {
	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(startOfDay);
	endOfDay.setDate(startOfDay.getDate() + 1);

	return { startOfDay, endOfDay };
}

export function getWeekRange(date: Date = new Date()) {
	const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
	const diffToMonday = day === 0 ? -6 : 1 - day;

	const startOfWeek = new Date(date);
	startOfWeek.setDate(date.getDate() + diffToMonday);
	startOfWeek.setHours(0, 0, 0, 0);

	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 7);
	endOfWeek.setHours(0, 0, 0, 0);

	return { startOfWeek, endOfWeek };
}

export const calculatePercentage = (value: number, target: number) => {
	return Math.min((value / target) * 100, 100);
};

export const formatDate = (date: string | Date) => {
	return new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(date));
};

export const truncateText = (text: string, maxLength: number) => {
	if (text.length <= maxLength) return text;

	return `${text.slice(0, maxLength - 3)}...`;
};

export type ProfileInfo =
	| {
			role: "teacher";
			major?: string;
	  }
	| {
			role: "student";
			grade: string;
			major: string;
			sub_major?: string;
	  };

export const parseProfileInfo = (profile: ProfileInfo, flat = false) => {
	if (flat) {
		if (profile.role === "teacher") {
			return profile.major ? `GURU_${profile.major}` : "";
		}

		return `${profile.grade} ${profile.major}${profile.sub_major ? `-${profile.sub_major}` : ""}`;
	}

	if (profile.role === "teacher") {
		return `${profile.major ? `${profile.major} (Admin)` : "Admin"} • GURU`;
	}

	return `${profile.grade} ${profile.major}${profile.sub_major ? `-${profile.sub_major}` : ""} • SISWA`;
};

export async function checkConnection(): Promise<boolean> {
	const state = await NetInfo.fetch();
	// isInternetReachable can be null while it's still determining —
	// treat that as "assume online" rather than a false negative

	return state.isConnected === true && state.isInternetReachable !== false;
}

export const randomBetween = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function assignKey<T, K extends keyof T>(
	target: Partial<T>,
	key: K,
	value: T[K],
) {
	target[key] = value;
}

export function sleepAsync(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
