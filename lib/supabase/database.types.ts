export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			app_public_informations: {
				Row: {
					key: string;
					value: string;
				};
				Insert: {
					key: string;
					value: string;
				};
				Update: {
					key?: string;
					value?: string;
				};
				Relationships: [];
			};
			classes: {
				Row: {
					id: number;
					grade: string;
					major: Database["public"]["Enums"]["major_type"];
					sub_major: string;
				};
				Insert: {
					id?: number;
					grade: string;
					major: Database["public"]["Enums"]["major_type"];
					sub_major: string;
				};
				Update: {
					id?: number;
					grade?: string;
					major?: Database["public"]["Enums"]["major_type"];
					sub_major?: string;
				};
				Relationships: [];
			};
			compost_activities: {
				Row: {
					id: number;
					created_at: string;
					class_id: number;
					submitted_by: string;
					submitted_by_role: string;
					photo?: string;
				};
				Insert: {
					id?: number;
					created_at?: string;
					class_id: number;
					submitted_by: string;
					submitted_by_role: string;
					photo?: string;
				};
				Update: {
					id?: number;
					created_at?: string;
					class_id?: number;
					submitted_by?: string;
					submitted_by_role?: string;
					photo?: string;
				};
				Relationships: [
					{
						foreignKeyName: "compost_activities_class_id_fkey";
						columns: ["class_id"];
						isOneToOne: false;
						referencedRelation: "classes";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "compost_activities_submitted_by_fkey";
						columns: ["submitted_by"];
						isOneToOne: false;
						referencedRelation: "students";
						referencedColumns: ["id"];
					},
				];
			};
			compost_participants: {
				Row: {
					id: number;
					compost_activity_id: number;
					student_id: string;
					attended: boolean;
				};
				Insert: {
					id?: number;
					compost_activity_id: number;
					student_id: string;
					attended?: boolean;
				};
				Update: {
					id?: number;
					compost_activity_id?: number;
					student_id?: string;
					attended?: boolean;
				};
				Relationships: [
					{
						foreignKeyName: "compost_participants_compost_activity_id_fkey";
						columns: ["compost_activity_id"];
						isOneToOne: false;
						referencedRelation: "compost_activities";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "compost_participants_student_id_fkey";
						columns: ["student_id"];
						isOneToOne: false;
						referencedRelation: "students";
						referencedColumns: ["id"];
					},
				];
			};
			garden_activities: {
				Row: {
					id: number;
					created_at: string;
					student_id: string;
					activity_type: string;
					location: string;
					photo?: string;
				};
				Insert: {
					id?: number;
					created_at?: string;
					student_id: string;
					activity_type: string;
					location: string;
					photo?: string;
				};
				Update: {
					id?: number;
					created_at?: string;
					student_id?: string;
					activity_type?: string;
					location?: string;
					photo?: string;
				};
				Relationships: [
					{
						foreignKeyName: "garden_activities_student_id_fkey";
						columns: ["student_id"];
						isOneToOne: false;
						referencedRelation: "students";
						referencedColumns: ["id"];
					},
				];
			};
			learning_lessons: {
				Row: {
					id: number;
					created_at: string;
					title: string;
					description: string;
					author: string;
					contents: LessonContent[];
					photo?: string;
				};
				Insert: {
					id?: number;
					created_at?: string;
					title: string;
					description: string;
					author: string;
					contents: LessonContent[];
					photo?: string;
				};
				Update: {
					id?: number;
					created_at?: string;
					title?: string;
					description?: string;
					author?: string;
					contents?: LessonContent[];
					photo?: string | null;
				};
				Relationships: [];
			};
			students: {
				Row: {
					id: number;
					user_id: string;
					created_at: string;
					username: string;
					class_id: number;
					name: string;
					nis: number;
					photo?: string;
				};
				Insert: {
					id?: number;
					user_id?: string;
					created_at?: string;
					username: string;
					class_id: number;
					name: string;
					nis: number;
					photo?: string;
				};
				Update: {
					id?: number;
					user_id?: string;
					created_at?: string;
					username?: string;
					class_id?: number;
					name?: string;
					nis?: number;
					photo?: string;
				};
				Relationships: [
					{
						foreignKeyName: "students_class_id_fkey";
						columns: ["class_id"];
						isOneToOne: false;
						referencedRelation: "classes";
						referencedColumns: ["id"];
					},
				];
			};

			teachers: {
				Row: {
					id: number;
					user_id: string;
					created_at: string;
					username: string;
					name: string;
					major: Database["public"]["Enums"]["major_type"];
					photo?: string;
				};
				Insert: {
					id?: number;
					user_id?: string;
					created_at?: string;
					username: string;
					name: string;
					major: Database["public"]["Enums"]["major_type"];
					photo?: string;
				};
				Update: {
					id?: number;
					user_id?: string;
					created_at?: string;
					username?: string;
					name?: string;
					major?: Database["public"]["Enums"]["major_type"];
					photo?: string;
				};
				Relationships: [];
			};
			waste_banks: {
				Row: {
					id: number;
					created_at: string;
					student_id: string;
					category: string;
					weight: number;
					price: number;
					photo: string;
				};
				Insert: {
					id?: number;
					created_at?: string;
					student_id: string;
					category: string;
					weight: number;
					price?: number;
					photo?: string;
				};
				Update: {
					id?: number;
					created_at?: string;
					student_id?: string;
					category?: string;
					weight?: number;
					price?: number;
					photo?: string;
				};
				Relationships: [
					{
						foreignKeyName: "waste_banks_student_id_fkey";
						columns: ["student_id"];
						isOneToOne: false;
						referencedRelation: "students";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			// TODO: replace with your actual enum values for the "major" column
			// (classes.major, teachers.major are USER-DEFINED / Postgres enum types).
			// e.g. major_type: "science" | "social" | "language"
			major_type: string;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

export type LessonContent = {
	id: string;
	title: string;
	explanation: string;
};

export type LessonType =
	Database["public"]["Tables"]["learning_lessons"]["Row"];

export type StudentType = Database["public"]["Tables"]["students"]["Row"];

export type TeacherType = Database["public"]["Tables"]["teachers"]["Row"];

export type TableName = keyof Database["public"]["Tables"];

export type TableRow<T extends TableName> =
	Database["public"]["Tables"][T]["Row"];
