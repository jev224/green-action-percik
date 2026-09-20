import { create } from "zustand";

type ActivityType = "waste-bank" | "compost-activity";

type ActivityTypeState<T extends string = ActivityType> = {
	activityType: T | null;
	setActivityType: (type: T) => void;
};

export const useActivityManagerStore = create<ActivityTypeState>((set) => ({
	activityType: null,
	setActivityType: (type) => set({ activityType: type }),
}));
