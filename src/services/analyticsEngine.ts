import { AttendanceRecord, SeverityLevel } from '../types/ims';

export interface StudentDiagnosticResult {
  studentId: string;
  overallAverage: number;
  classAverageDelta: number;
  attendanceRate: number;
  subjectWeaknesses: Array<{ subject: string; average: number; targetGap: number }>;
  subjectStrengths: Array<{ subject: string; average: number }>;
  flags: Array<{
    category: 'ATTENDANCE' | 'ACADEMIC_DROP' | 'HOMEWORK' | 'CHRONIC_WEAKNESS';
    severity: SeverityLevel;
    message: string;
  }>;
  automatedRecommendations: string[];
}

export interface StudentTestDiagnosticInput {
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  testDate: string | Date;
  classAveragePct: number;
}

export function computeStudentDiagnostics(
  studentId: string,
  studentTests: StudentTestDiagnosticInput[],
  attendanceRecords: AttendanceRecord[],
  pendingHomeworkCount: number
): StudentDiagnosticResult {
  const flags: StudentDiagnosticResult['flags'] = [];
  const recommendations: string[] = [];

  // 1. Attendance Analysis
  const totalSessions = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
  const attendanceRate = totalSessions > 0 ? (presentCount / totalSessions) * 100 : 100;

  if (attendanceRate < 75.0) {
    flags.push({
      category: 'ATTENDANCE',
      severity: attendanceRate < 60.0 ? 'CRITICAL' : 'HIGH',
      message: `Attendance is low at ${attendanceRate.toFixed(1)}% (below 75% baseline). Missed lessons directly impact upcoming exams.`
    });
    recommendations.push('Schedule mandatory parental counseling regarding classroom absenteeism.');
    recommendations.push('Assign peer study-buddy for note synchronization during missed lectures.');
  }

  // 2. Subject Breakdown
  const subjectMap = new Map<string, { totalPct: number; count: number; recentScores: number[]; classSumPct: number }>();
  for (const t of studentTests) {
    const pct = t.maxMarks > 0 ? (t.marksObtained / t.maxMarks) * 100 : 0;
    const existing = subjectMap.get(t.subjectName) || { totalPct: 0, count: 0, recentScores: [], classSumPct: 0 };
    existing.totalPct += pct;
    existing.count += 1;
    existing.recentScores.push(pct);
    existing.classSumPct += t.classAveragePct;
    subjectMap.set(t.subjectName, existing);
  }

  const subjectWeaknesses: StudentDiagnosticResult['subjectWeaknesses'] = [];
  const subjectStrengths: StudentDiagnosticResult['subjectStrengths'] = [];
  let sumStudentAverages = 0;
  let sumClassAverages = 0;
  let totalSubjects = 0;

  subjectMap.forEach((val, subject) => {
    totalSubjects++;
    const avg = val.totalPct / val.count;
    const classAvg = val.classSumPct / val.count;
    sumStudentAverages += avg;
    sumClassAverages += classAvg;

    if (avg < 50.0) {
      const targetGap = 65.0 - avg;
      subjectWeaknesses.push({ subject, average: Number(avg.toFixed(1)), targetGap: Number(targetGap.toFixed(1)) });
      flags.push({
        category: 'CHRONIC_WEAKNESS',
        severity: avg < 40 ? 'HIGH' : 'MEDIUM',
        message: `Persistent struggle in ${subject} (${avg.toFixed(1)}% avg vs ${classAvg.toFixed(1)}% class mean).`
      });
      recommendations.push(`Initiate 4-week remedial bridge module in ${subject} with targeted concept drills.`);
    } else if (avg >= 75.0) {
      subjectStrengths.push({ subject, average: Number(avg.toFixed(1)) });
    }

    // Check for acute academic drop >= 15%
    if (val.recentScores.length >= 2) {
      const latest = val.recentScores[val.recentScores.length - 1];
      const previous = val.recentScores[val.recentScores.length - 2];
      const drop = previous - latest;
      if (drop >= 15.0) {
        flags.push({
          category: 'ACADEMIC_DROP',
          severity: drop >= 25.0 ? 'HIGH' : 'MEDIUM',
          message: `Sharp score contraction of ${drop.toFixed(1)}% in latest ${subject} assessment.`
        });
        recommendations.push(`Conduct 1-on-1 diagnostic review with subject instructor for ${subject}.`);
      }
    }
  });

  // 3. Homework Compliance
  if (pendingHomeworkCount >= 3) {
    flags.push({
      category: 'HOMEWORK',
      severity: pendingHomeworkCount >= 5 ? 'CRITICAL' : 'HIGH',
      message: `${pendingHomeworkCount} consecutive homework assignments pending or overdue.`
    });
    recommendations.push('Enforce daily post-school supervised study hall until backlog clears.');
  }

  const overallAverage = totalSubjects > 0 ? sumStudentAverages / totalSubjects : 0;
  const overallClassAverage = totalSubjects > 0 ? sumClassAverages / totalSubjects : 0;
  const classAverageDelta = overallAverage - overallClassAverage;

  if (recommendations.length === 0) {
    recommendations.push('Maintain current momentum and enter national STEM Olympiad challenge.');
    recommendations.push('Nominate for academic peer-tutoring fellowship.');
  }

  return {
    studentId,
    overallAverage: Number(overallAverage.toFixed(1)),
    classAverageDelta: Number(classAverageDelta.toFixed(1)),
    attendanceRate: Number(attendanceRate.toFixed(1)),
    subjectWeaknesses,
    subjectStrengths,
    flags,
    automatedRecommendations: Array.from(new Set(recommendations))
  };
}
