import { create } from "zustand";

type TaskStatus = "idle" | "running" | "success" | "error";

export type TaskEntry<T = unknown> = {
	status: TaskStatus;
	progress?: number;
	progressMessage?: string;
	result?: T;
	error?: string;
	startedAt?: number;
	finishedAt?: number;
};

type AsyncTaskState = {
	tasks: Record<string, TaskEntry>;

	// Kick off a task by id. `fn` receives a `setProgress` helper
	// so long jobs can report progress (0-100) as they go.
	runTask: <T>(
		id: string,
		fn: (setProgress: (value: number, message: string) => void) => Promise<T>,
	) => Promise<void>;

	getTask: (id: string) => TaskEntry | undefined;
	clearTask: (id: string) => void;
	reset: () => void;
};

export const useAsyncTaskStore = create<AsyncTaskState>((set, get) => ({
	tasks: {},

	runTask: async (id, fn) => {
		// Avoid starting the same task twice while it's already running
		const existing = get().tasks[id];
		if (existing?.status === "running") return;

		set((state) => ({
			tasks: {
				...state.tasks,
				[id]: { status: "running", progress: 0, startedAt: Date.now() },
			},
		}));

		const setProgress = (value: number, message: string) => {
			set((state) => ({
				tasks: {
					...state.tasks,
					[id]: {
						...state.tasks[id],
						progress: value,
						progressMessage: message,
					},
				},
			}));
		};

		try {
			const result = await fn(setProgress);
			set((state) => ({
				tasks: {
					...state.tasks,
					[id]: {
						...state.tasks[id],
						status: "success",
						result,
						progress: 100,
						finishedAt: Date.now(),
					},
				},
			}));
		} catch (err) {
			set((state) => ({
				tasks: {
					...state.tasks,
					[id]: {
						...state.tasks[id],
						status: "error",
						error: err instanceof Error ? err.message : String(err),
						finishedAt: Date.now(),
					},
				},
			}));
		}
	},

	getTask: (id) => get().tasks[id],

	clearTask: (id) => {
		set((state) => {
			const next = { ...state.tasks };
			delete next[id];
			return { tasks: next };
		});
	},

	reset: () => set({ tasks: {} }),
}));
