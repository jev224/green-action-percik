import * as XLSX from "xlsx";
import {
	fetchAllCompostActivities,
	fetchAllCompostParticipants,
	fetchAllGardenActivities,
	fetchAllWasteBanks,
} from "@/services/fetcher/activity/teacherActivityManager";
import { fetchAllStudentClasses } from "@/services/fetcher/student/studentClass";
import { fetchStudentsByClass } from "@/services/fetcher/student/studentQuery";
import { parseClassName } from "@/utils";

type XLSLSheetFormat = {
	"No.": number;
	"Nama Siswa": string;
	NIS: number;

	"Kegiatan Kebun": number;

	"Kehadiran Kompos": number;
	"Total Kegiatan Kompos": number;

	"Pengumpulan Sampah": number;
	"Berat Sampah Total (kg)": number;
	"Harga Sampah Total (Rp)": number;

	"Total Poin": number;
};

export const createExcelFile = async (
	start: Date,
	end: Date | undefined,
	setProgress: (value: number, message: string) => void,
) => {
	setProgress(10, "Memuat data kelas...");
	const classes = await fetchAllStudentClasses();

	setProgress(20, "Memuat data kompos...");
	const compostActivities = await fetchAllCompostActivities(start, end);
	const compostParticipants = await fetchAllCompostParticipants(start, end);

	setProgress(30, "Memuat data bank sampah...");
	const wasteBanks = await fetchAllWasteBanks(start, end);

	setProgress(40, "Memuat data aktivitas kebun...");
	const gardenActivities = await fetchAllGardenActivities(start, end);

	const workbook = XLSX.utils.book_new();

	const totalClasses = classes.length;

	for (const [classIndex, classData] of classes.entries()) {
		const data: XLSLSheetFormat[] = [];

		const className = parseClassName(classData);

		setProgress(
			40 + Math.round((classIndex / totalClasses) * 50),
			`Memuat siswa kelas ${className}...`,
		);

		const students = await fetchStudentsByClass(classData.id);

		const classCompostActivities = compostActivities.filter(
			({ class_id }) => class_id === classData.id,
		);

		const classCompostActivityIds = new Set(
			classCompostActivities.map(({ id }) => id),
		);

		const classCompostActivitiesCount = classCompostActivities.length;

		for (const [index, student] of students.entries()) {
			const gardenActivitiesTotal = gardenActivities.filter(
				({ student_id }) => student_id === student.user_id,
			).length;

			const compostAttendanceTotal = compostParticipants.filter(
				({ student_id, compost_activity_id, attended }) =>
					student_id === student.user_id &&
					classCompostActivityIds.has(compost_activity_id) &&
					attended,
			).length;

			const studentWasteBanks = wasteBanks.filter(
				({ student_id }) => student_id === student.user_id,
			);

			const studentWasteBanksTotal = studentWasteBanks.length;

			const studentWasteBanksTotalWeight = studentWasteBanks.reduce(
				(total, { weight }) => total + (weight ?? 0),
				0,
			);

			const studentWasteBanksTotalPrice = studentWasteBanks.reduce(
				(total, { price }) => total + (price ?? 0),
				0,
			);

			data.push({
				"No.": index + 1,
				"Nama Siswa": student.name,
				NIS: student.nis,

				"Kegiatan Kebun": gardenActivitiesTotal,

				"Kehadiran Kompos": compostAttendanceTotal,
				"Total Kegiatan Kompos": classCompostActivitiesCount,

				"Pengumpulan Sampah": studentWasteBanksTotal,
				"Berat Sampah Total (kg)": studentWasteBanksTotalWeight,
				"Harga Sampah Total (Rp)": studentWasteBanksTotalPrice,

				"Total Poin": student.points,
			});
		}

		setProgress(
			40 + Math.round(((classIndex + 1) / totalClasses) * 50),
			`Membuat sheet ${className}...`,
		);

		const worksheet = XLSX.utils.json_to_sheet(data);

		XLSX.utils.book_append_sheet(workbook, worksheet, className);
	}

	setProgress(95, "Membuat file Excel...");

	return XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
};
