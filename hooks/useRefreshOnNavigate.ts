export let shouldRefresh = false;

export function refreshOnNextNavigate() {
	shouldRefresh = true;
}

export function clearRefresh() {
	shouldRefresh = false;
}
