import type { ToastOptions } from "./type";

type ToastData = ToastOptions & {
	id: string;
};

let toasts: ToastData[] = [];
const listeners = new Set<() => void>();

function emit() {
	for (const listener of listeners) {
		listener();
	}
}

export function addToast(toast: ToastData) {
	toasts = [...toasts, toast];
	emit();
}

export function shiftToast() {
	toasts.shift();
	emit();
}

export function getToasts() {
	return toasts;
}

export function subscribeToasts(listener: () => void) {
	listeners.add(listener);

	return () => {
		listeners.delete(listener);
	};
}
