import type React from "react";
import {
	FlatList,
	Platform,
	ScrollView,
	type ScrollViewProps,
} from "react-native";
import { NativeRefreshControl, type RefreshControlProps } from "./index.web";

// react-native-web injects `children` into the refreshControl element itself,
// so from the caller's side it should not be required.
const WebRefreshControl =
	NativeRefreshControl as unknown as React.ComponentType<
		Omit<RefreshControlProps, "children">
	>;

export type PatchFlatListOptions = Partial<
	Omit<RefreshControlProps, "refreshing" | "onRefresh" | "children">
>;

// FlatList passes its own props through to renderScrollComponent,
// including refreshing / onRefresh.
type ScrollComponentProps = ScrollViewProps & {
	refreshing?: boolean | null;
	onRefresh?: (() => void) | null;
};

export function patchFlatListProps(options: PatchFlatListOptions = {}): void {
	try {
		if (Platform.OS === "web") {
			setCustomFlatListWeb(options);
		}
	} catch (e) {
		console.error(e);
	}
}

function setCustomFlatListWeb(options: PatchFlatListOptions): void {
	const list = FlatList as unknown as {
		defaultProps?: Record<string, unknown>;
	};

	list.defaultProps = {
		...list.defaultProps,
		renderScrollComponent: (props: ScrollComponentProps) => (
			<ScrollView
				{...props}
				refreshControl={
					<WebRefreshControl
						{...options}
						refreshing={!!props.refreshing}
						onRefresh={props.onRefresh ?? undefined}
					/>
				}
			/>
		),
	};
}
