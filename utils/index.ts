import NetInfo from "@react-native-community/netinfo";
import { Platform } from "react-native";
import { ServerError } from "@/services/ServerError";
import type { ClassData } from "@/types";

export const sumReduceFn = (sum: number, curr: number) => sum + curr;

export function nativeOnlyProps<T extends object>(props: T): Partial<T> {
	return Platform.OS !== "web" ? props : {};
}

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

export const formatPrice = (price: number) => {
	return new Intl.NumberFormat("id-ID").format(price);
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
			sub_major: string | null;
	  };

export const parseProfileInfo = (profile: ProfileInfo) => {
	if (profile.role === "teacher") {
		return `${profile.major ? `${profile.major} (Admin)` : "Admin"} • GURU`;
	}

	return `${profile.grade} ${profile.major}${profile.sub_major ? `-${profile.sub_major}` : ""} • SISWA`;
};

export const formatClassPathSegment = (classData: ClassData) => {
	const { grade, major, sub_major } = classData;
	return `${grade}_${major}${sub_major ? `-${sub_major}` : ""}`;
};

export const parseClassName = (classData: {
	grade: string;
	major: string;
	sub_major: string | null;
}) =>
	`${classData.grade} ${classData.major}${classData.sub_major ? `-${classData.sub_major}` : ""}`;

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

type NormalizedError = {
	name: string;
	message: string;
	uiMessage: string;
	status?: number;
};

const FALLBACK_UI_MESSAGE = "Terjadi kesalahan. Coba lagi";

export function normalizeError(error: unknown, label: string): NormalizedError {
	if (error instanceof ServerError) {
		console.log(
			label,
			error.status ?? `[${error.status}]`,
			`(${error.name}):`,
			error.message,
		);

		return {
			name: error.name,
			message: error.message,
			uiMessage: error.ui_message,
			status: error.status,
		};
	}

	if (error instanceof Error) {
		console.log(label, `(${error.name}):`, error.message);

		return {
			name: error.name,
			message: error.message,
			uiMessage: FALLBACK_UI_MESSAGE,
		};
	}

	const name = "unknown";
	const message = `An error occured with no reason: ${error}`;

	console.log(label, `(${name}):`, message);

	return {
		name,
		message,
		uiMessage: FALLBACK_UI_MESSAGE,
	};
}
