export type StringKeys<T> = {
	[K in keyof T]: T[K] extends string | null ? K : never;
}[keyof T];

export interface ClassData {
	grade: string;
	major: string;
	sub_major: string | null;
}
