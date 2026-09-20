export type StringKeys<T> = {
	[K in keyof T]: T[K] extends string | undefined ? K : never;
}[keyof T];
