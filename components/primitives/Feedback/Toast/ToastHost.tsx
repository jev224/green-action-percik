import { useSyncExternalStore } from "react";
import { View } from "react-native";
import { StackedToast } from "./StackedToast";
import { getToasts, subscribeToasts } from "./toastStack";

export function ToastHost() {
	const toasts = useSyncExternalStore(subscribeToasts, getToasts, getToasts);

	return (
		<View pointerEvents="box-none" className="absolute w-full bottom-24 h-24 ">
			{toasts.map((toast, index, arr) => (
				<StackedToast
					key={toast.id}
					index={index}
					total={arr.length}
					title={toast.title}
					description={toast.description}
					duration={toast.duration}
				/>
			))}
		</View>
	);
}
