export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "14.5";
	};
	public: {
		Tables: {
			all_student_targets: {
				Row: {
					compost_activity: number | null;
					garden_activity: number | null;
					id: number;
					waste_weight: number | null;
				};
				Insert: {
					compost_activity?: number | null;
					garden_activity?: number | null;
					id?: number;
					waste_weight?: number | null;
				};
				Update: {
					compost_activity?: number | null;
					garden_activity?: number | null;
					id?: number;
					waste_weight?: number | null;
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
					grade: string;
					id: number;
					major: Database["public"]["Enums"]["class_major_enum"];
					sub_major: string | null;
				};
				Insert: {
					grade: string;
					id?: number;
					major: Database["public"]["Enums"]["class_major_enum"];
					sub_major?: string | null;
				};
				Update: {
					grade?: string;
					id?: number;
					major?: Database["public"]["Enums"]["class_major_enum"];
					sub_major?: string | null;
				};
				Relationships: [];
			};
			completed_lessons: {
				Row: {
					created_at: string;
					id: number;
					lesson_id: number;
					student_id: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					lesson_id: number;
					student_id?: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					lesson_id?: number;
					student_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "completed_lessons_lesson_id_fkey";
						columns: ["lesson_id"];
						isOneToOne: true;
						referencedRelation: "learning_lessons";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "completed_lessons_student_id_fkey";
						columns: ["student_id"];
						isOneToOne: false;
						referencedRelation: "students";
						referencedColumns: ["user_id"];
					},
				];
			};
			compost_activities: {
				Row: {
					class_id: number;
					created_at: string;
					id: number;
					photo: string | null;
					submitted_by: string;
					submitted_by_role: string;
				};
				Insert: {
					class_id: number;
					created_at?: string;
					id?: number;
					photo?: string | null;
					submitted_by?: string;
					submitted_by_role: string;
				};
				Update: {
					class_id?: number;
					created_at?: string;
					id?: number;
					photo?: string | null;
					submitted_by?: string;
					submitted_by_role?: string;
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
						referencedColumns: ["user_id"];
					},
				];
			};
			compost_participants: {
				Row: {
					attended: boolean;
					compost_activity_id: number;
					created_at: string;
					id: number;
					student_id: string;
				};
				Insert: {
					attended?: boolean;
					compost_activity_id: number;
					created_at?: string;
					id?: number;
					student_id?: string;
				};
				Update: {
					attended?: boolean;
					compost_activity_id?: number;
					created_at?: string;
					id?: number;
					student_id?: string;
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
						referencedColumns: ["user_id"];
					},
				];
			};
			garden_activities: {
				Row: {
					activity_type: string | null;
					created_at: string;
					id: number;
					location: string | null;
					photo: string | null;
					student_id: string;
				};
				Insert: {
					activity_type?: string | null;
					created_at?: string;
					id?: number;
					location?: string | null;
					photo?: string | null;
					student_id?: string;
				};
				Update: {
					activity_type?: string | null;
					created_at?: string;
					id?: number;
					location?: string | null;
					photo?: string | null;
					student_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "garden_activities_student_id_fkey";
						columns: ["student_id"];
						isOneToOne: false;
						referencedRelation: "students";
						referencedColumns: ["user_id"];
					},
				];
			};
			learning_lessons: {
				Row: {
					author: string;
					contents: Json;
					created_at: string;
					description: string;
					id: number;
					photo: string | null;
					title: string;
				};
				Insert: {
					author: string;
					contents?: Json;
					created_at?: string;
					description: string;
					id?: number;
					photo?: string | null;
					title: string;
				};
				Update: {
					author?: string;
					contents?: Json;
					created_at?: string;
					description?: string;
					id?: number;
					photo?: string | null;
					title?: string;
				};
				Relationships: [];
			};
			motivations: {
				Row: {
					author: string;
					id: number;
					quote: string;
				};
				Insert: {
					author: string;
					id?: number;
					quote: string;
				};
				Update: {
					author?: string;
					id?: number;
					quote?: string;
				};
				Relationships: [];
			};
			student_targets: {
				Row: {
					compost_activity: number | null;
					garden_activity: number | null;
					id: number;
					student_id: string;
					waste_weight: number | null;
				};
				Insert: {
					compost_activity?: number | null;
					garden_activity?: number | null;
					id?: number;
					student_id?: string;
					waste_weight?: number | null;
				};
				Update: {
					compost_activity?: number | null;
					garden_activity?: number | null;
					id?: number;
					student_id?: string;
					waste_weight?: number | null;
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
					class_id: number;
					created_at: string;
					id: number;
					name: string;
					nis: number;
					photo: string | null;
					points: number;
					user_id: string | null;
					username: string;
				};
				Insert: {
					class_id: number;
					created_at?: string;
					id?: number;
					name: string;
					nis: number;
					photo?: string | null;
					points?: number;
					user_id?: string | null;
					username: string;
				};
				Update: {
					class_id?: number;
					created_at?: string;
					id?: number;
					name?: string;
					nis?: number;
					photo?: string | null;
					points?: number;
					user_id?: string | null;
					username?: string;
				};
				Relationships: [
					{
						foreignKeyName: "students_class_id_fkey1";
						columns: ["class_id"];
						isOneToOne: false;
						referencedRelation: "classes";
						referencedColumns: ["id"];
					},
				];
			};
			teachers: {
				Row: {
					created_at: string;
					id: number;
					major: Database["public"]["Enums"]["class_major_enum"];
					name: string;
					photo: string | null;
					user_id: string | null;
					username: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					major: Database["public"]["Enums"]["class_major_enum"];
					name: string;
					photo?: string | null;
					user_id?: string | null;
					username: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					major?: Database["public"]["Enums"]["class_major_enum"];
					name?: string;
					photo?: string | null;
					user_id?: string | null;
					username?: string;
				};
				Relationships: [];
			};
			waste_banks: {
				Row: {
					category: string;
					created_at: string;
					id: number;
					paid: boolean;
					photo: string | null;
					price: number | null;
					student_id: string;
					weight: number | null;
				};
				Insert: {
					category: string;
					created_at?: string;
					id?: number;
					paid?: boolean;
					photo?: string | null;
					price?: number | null;
					student_id?: string;
					weight?: number | null;
				};
				Update: {
					category?: string;
					created_at?: string;
					id?: number;
					paid?: boolean;
					photo?: string | null;
					price?: number | null;
					student_id?: string;
					weight?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "waste_banks_student_id_fkey";
						columns: ["student_id"];
						isOneToOne: false;
						referencedRelation: "students";
						referencedColumns: ["user_id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			finalize_new_user: {
				Args: { user_id: string; user_role: string };
				Returns: undefined;
			};
			get_monthly_waste_weight: {
				Args: { p_end: string; p_start: string; p_student_id?: string };
				Returns: number;
			};
			get_student_id_for_current_user: { Args: never; Returns: string };
			get_total_student_points: { Args: never; Returns: number };
			get_unpaid_student_waste_total: {
				Args: { p_student_id?: string };
				Returns: number;
			};
			student_uploaded_today: {
				Args: { p_activity_folder: string; p_student_id: string };
				Returns: boolean;
			};
			students_with_unpaid_waste_banks: {
				Args: never;
				Returns: {
					class_id: number;
					created_at: string;
					id: number;
					name: string;
					nis: number;
					photo: string | null;
					points: number;
					user_id: string | null;
					username: string;
				}[];
				SetofOptions: {
					from: "*";
					to: "students";
					isOneToOne: false;
					isSetofReturn: true;
				};
			};
		};
		Enums: {
			class_major_enum:
				| "RPL"
				| "TITL"
				| "TEI"
				| "DKV"
				| "MO"
				| "TKJ"
				| "TKR"
				| "TP";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {
			class_major_enum: ["RPL", "TITL", "TEI", "DKV", "MO", "TKJ", "TKR", "TP"],
		},
	},
} as const;
