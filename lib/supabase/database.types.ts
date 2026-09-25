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
			motivations: {
				Row: {
					id: number;
					quote: string;
					author: string;
				};
				Insert: {
					id?: number;
					quote: string;
					author: string;
				};
				Update: {
					id?: number;
					quote?: string;
					author?: string;
				};
				Relationships: [];
			};

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
			completed_lessons: {
				Row: {
					id: number;
					lesson_id: number;
					student_id: string;
					created_at: string;
				};
				Insert: {
					id?: number;
					lesson_id: number;
					student_id: string;
					created_at?: string;
				};
				Update: {
					id?: number;
					lesson_id?: number;
					student_id?: string;
					created_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "completed_lessons_lesson_id_fkey";
						columns: ["lesson_id"];
						isOneToOne: false;
						referencedRelation: "learning_lessons";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "completed_lessons_student_id_fkeyy";
						columns: ["student_id"];
						isOneToOne: false;
						referencedRelation: "students";
						referencedColumns: ["user_id"];
					},
				];
			};

			all_student_targets: {
				Row: {
					id: number;
					waste_weight: number;
					compost_activity: number;
					garden_activity: number;
				};
				Insert: {
					id?: number;
					waste_weight?: number;
					compost_activity?: number;
					garden_activity?: number;
				};
				Update: {
					id?: number;
					waste_weight?: number;
					compost_activity?: number;
					garden_activity?: number;
				};
				Relationships: [];
			};

			student_targets: {
				Row: {
					id: number;
					student_id: string;
					waste_weight: number;
					compost_activity: number;
					garden_activity: number;
				};
				Insert: {
					id?: number;
					student_id: string;
					waste_weight?: number;
					compost_activity?: number;
					garden_activity?: number;
				};
				Update: {
					student_id?: string;
					waste_weight?: number;
					compost_activity?: number;
					garden_activity?: number;
				};
				Relationships: [
					{
						foreignKeyName: "student_targets_student_id_fkey";
						columns: ["student_id"];
						isOneToOne: false;
						referencedRelation: "students";
						referencedColumns: ["user_id"];
					},
				];
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
					points: number;
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
					points?: number;
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
					points?: number;
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
			get_total_student_points: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			get_monthly_waste_weight: {
				Args: {
					p_start: string;
					p_end: string;
					p_student_id?: string;
				};
				Returns: number;
			};
			get_unpaid_student_waste_total: {
				Args: {
					p_student_id?: string;
				};
				Returns: number;
			};
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
