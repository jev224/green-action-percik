export let shouldRefresh = false;

export function useRefreshOnNavigate() {
  shouldRefresh = true;
}

export function clearRefresh() {
  shouldRefresh = false;
}
