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

  return text.slice(0, maxLength - 3) + "...";
};

type ProfileInfo =
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

export const parseProfileInfo = (profile: ProfileInfo) => {
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
