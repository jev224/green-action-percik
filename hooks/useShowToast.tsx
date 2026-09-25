import {
	useCallback,
	useEffect,
	useRef,
	useState,
	useSyncExternalStore,
} from "react";
import { useWindowDimensions } from "react-native";
import {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { AnimationNone } from "@/components/animation/presets";
import {
	Toast,
	ToastDescription,
	ToastTitle,
	useToast,
} from "@/components/ui/toast";

type ShowToastOptions = {
	title: string;
	description?: string;
	action?: "error" | "warning" | "success" | "info" | "muted";
	variant?: "solid" | "outline";
	duration?: number;
	placement?:
		| "top"
		| "bottom"
		| "top right"
		| "top left"
		| "bottom right"
		| "bottom left";
};

let stack: string[] = [];
const listeners = new Set<() => void>();

function emit() {
	for (const l of listeners) l();
}

export function pushToastId(id: string) {
	stack = [...stack, id];
	emit();
}

export function removeToastId(id: string) {
	stack = stack.filter((t) => t !== id);
	emit();
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function getSnapshot() {
	return stack;
}

// Returns this toast's depth from the front (0 = newest/frontmost),
// live-updating whenever the shared stack changes.
export function useToastDepth(id: string) {
	const order = useSyncExternalStore(subscribe, getSnapshot);
	const index = order.indexOf(id);
	if (index === -1) return 0;
	return Math.max(order.length - 1 - index, 0);
}

export function useShowToast() {
	const { width } = useWindowDimensions();
	const toast = useToast();

	const [toastId, setToastId] = useState(0);
	const stackOrderRef = useRef<string[]>([]);

	const showToast = useCallback(
		({
			title,
			description,
			action = "muted",
			variant = "solid",
			duration = 3000,
			placement = "bottom",
		}: ShowToastOptions) => {
			const newId = String(Date.now() + toastId + 1);
			setToastId((prev) => prev++);

			const id = String(newId);
			const isTop = placement.startsWith("top");

			pushToastId(id);

			toast.show({
				id,
				placement,
				duration,
				containerStyle: {
					position: "absolute",
					bottom: 0,
					left: -width * 0.5,
					width,
				},
				onCloseComplete: () => {
					stackOrderRef.current = stackOrderRef.current.filter(
						(id) => id !== newId,
					);
				},
				render: ({ id }) => (
					<StackedToast
						id={id}
						isTop={isTop}
						title={title}
						description={description}
						action={action}
						variant={variant}
					/>
				),
			});
		},

		[toast, toastId],
	);

	return showToast;
}
const MAX_STACK_SIZE = 3;

const STACK_DURATION = 350;

const STACK_EASING = Easing.out(Easing.circle);

export function StackedToast({
	id,
	isTop,
	action,
	variant,
	title,
	description,
}: {
	id: string;
	isTop: boolean;
	action: "error" | "warning" | "success" | "info" | "muted";
	variant: "solid" | "outline";
	title: string;
	description?: string;
}) {
	const depth = useToastDepth(id);
	const direction = isTop ? 1 : -1;

	const translateY = useSharedValue(100);
	const scale = useSharedValue(1.05);
	const opacity = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateY: translateY.value,
			},
			{
				scale: scale.value,
			},
		],
		opacity: opacity.value,
	}));

	useEffect(() => {
		if (depth >= MAX_STACK_SIZE) {
			opacity.value = withTiming(0.8, {
				duration: 180,
				easing: STACK_EASING,
			});
		}

		translateY.value = withTiming(direction * (depth * 16 - depth ** 2.5), {
			duration: STACK_DURATION,
			easing: STACK_EASING,
		});

		scale.value = withTiming(1 - depth * 0.1, {
			duration: STACK_DURATION,
			easing: STACK_EASING,
		});
	}, [depth, direction]);

	// Don't render toasts that are too deep in the stack.
	if (depth >= MAX_STACK_SIZE * 2) {
		return null;
	}

	return (
		<Toast
			nativeID={`toast-${id}`}
			action={action}
			variant={variant}
			className="self-center mb-12 mx-4"
			style={animatedStyle}
			entering={AnimationNone}
			exiting={AnimationNone}
		>
			<ToastTitle>{title}</ToastTitle>

			{description && <ToastDescription>{description}</ToastDescription>}
		</Toast>
	);
}
