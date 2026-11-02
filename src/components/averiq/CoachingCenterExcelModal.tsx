import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileSpreadsheet,
  Layers,
  Database,
  Calculator,
  Users,
  CreditCard,
  Calendar,
  Award,
  PhoneCall,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface SheetDefinition {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  recommendedUse: string;
  headers: string[];
  sampleRows: (string | number)[][];
  formulas?: { label: string; formula: string; explanation: string }[];
}

export const COACHING_SHEETS: SheetDefinition[] = [
  {
    id: 'students',
    name: '1. Student Admissions',
    icon: Users,
    description: 'Master enrollment database for every student enrolled in the coaching center.',
    recommendedUse: 'Record complete student profiles, contacts, schools, assigned batch, and agreed course fees.',
    headers: [
      'Student_ID',
      'Admission_Date',
      'Student_Name',
      'Gender',
      'DOB',
      'Target_Exam',
      'Grade_Level',
      'Assigned_Batch',
      'Curriculum_Board',
      'Father_Name',
      'Mother_Name',
      'Primary_Phone',
      'Emergency_Phone',
      'Email_Address',
      'School_Name',
      'Total_Course_Fee',
      'Scholarship_Discount',
      'Net_Fee_Payable',
      'Admission_Status'
    ],
    sampleRows: [
      ['STU-2026-001', '2026-04-01', 'Aarav Patel', 'MALE', '2009-03-14', 'JEE Main + Boards', '10th Standard', '10A-Morning-Engg', 'CBSE', 'Rajesh Patel', 'Sunita Patel', '+91 98201 12345', '+91 98201 12340', 'aarav.patel@example.com', 'Delhi Public School', 65000, 5000, 60000, 'ACTIVE'],
      ['STU-2026-002', '2026-04-02', 'Diya Sharma', 'FEMALE', '2009-08-22', 'NEET Foundation', '10th Standard', '10A-Morning-Med', 'ICSE', 'Manoj Sharma', 'Anita Sharma', '+91 98201 23456', '+91 98201 23450', 'diya.sharma@example.com', 'St. Mary High School', 70000, 10000, 60000, 'ACTIVE'],
      ['STU-2026-003', '2026-04-03', 'Rohan Verma', 'MALE', '2008-11-05', 'JEE Advanced 2-Yr', '11th Standard', '11-JEE-Weekend', 'CBSE', 'Vikram Verma', 'Pooja Verma', '+91 98201 34567', '+91 98201 34560', 'rohan.verma@example.com', 'Kendriya Vidyalaya', 85000, 0, 85000, 'ACTIVE'],
      ['STU-2026-004', '2026-04-04', 'Ananya Iyer', 'FEMALE', '2009-01-30', 'Class 10 Board Toppers', '10th Standard', '10B-Evening-Reg', 'State Board', 'Suresh Iyer', 'Lakshmi Iyer', '+91 98201 45678', '+91 98201 45670', 'ananya.iyer@example.com', 'National Model School', 45000, 3000, 42000, 'ACTIVE'],
      ['STU-2026-005', '2026-04-05', 'Kabir Mehta', 'MALE', '2010-06-18', 'Junior Olympiad + 9th', '9th Standard', '9A-Foundation-Sun', 'CBSE', 'Nitin Mehta', 'Kavita Mehta', '+91 98201 56789', '+91 98201 56780', 'kabir.mehta@example.com', 'Bombay Scottish School', 50000, 5000, 45000, 'ACTIVE']
    ],
    formulas: [
      {
        label: 'Net Fee Payable Calculation',
        formula: '=P2-Q2',
        explanation: 'Calculates Net Fee Payable by subtracting Scholarship/Discount (Col Q) from Total Course Fee (Col P).'
      },
      {
        label: 'Auto-Generate Student ID',
        formula: '="STU-2026-" & TEXT(ROW()-1, "000")',
        explanation: 'Generates sequential IDs like STU-2026-001, STU-2026-002 down the sheet.'
      }
    ]
  },
  {
    id: 'batches',
    name: '2. Batches & Streams',
    icon: Layers,
    description: 'Scheduling and capacity allocation for classes, competitive exam streams, and time slots.',
    recommendedUse: 'Manage classroom halls, batch timings, maximum seat limits, and assigned faculty mentors.',
    headers: [
      'Batch_Code',
      'Batch_Name',
      'Target_Standard',
      'Target_Exam',
      'Schedule_Days',
      'Timings',
      'Classroom_Hall',
      'Max_Capacity',
      'Current_Enrolled',
      'Faculty_Lead',
      'Batch_Status'
    ],
    sampleRows: [
      ['10A-Morning-Engg', 'Class 10 Super 30 JEE Foundation', '10th Standard', 'JEE Main / Boards', 'Mon, Wed, Fri', '07:00 AM - 09:30 AM', 'Lecture Hall 1 (Ground Floor)', 25, 20, 'Dr. Arvind Sharma (Physics)', 'ACTIVE'],
      ['10A-Morning-Med', 'Class 10 Medical Pioneers NEET', '10th Standard', 'NEET Foundation', 'Tue, Thu, Sat', '07:00 AM - 09:30 AM', 'Lecture Hall 2 (Ground Floor)', 25, 15, 'Dr. Meenakshi Sundaram (Bio)', 'ACTIVE'],
      ['9A-Foundation-Sun', 'Class 9 Olympiad & NTSE Batch', '9th Standard', 'NTSE / Olympiad', 'Mon, Wed, Fri', '04:30 PM - 07:00 PM', 'Hall 3 (First Floor)', 20, 9, 'Prof. Rajesh Kulkarni (Maths)', 'ACTIVE'],
      ['8A-General-Eve', 'Class 8 Smart Foundation', '8th Standard', 'CBSE / ICSE Boards', 'Tue, Thu, Sat', '04:30 PM - 06:30 PM', 'Classroom 4', 20, 6, 'Mrs. Shalini Gupta (Science)', 'ACTIVE'],
      ['11-JEE-Weekend', 'Class 11 Target JEE 2027 Intensive', '11th Standard', 'JEE Advanced', 'Saturday & Sunday', '08:00 AM - 02:00 PM', 'Auditorium A', 40, 32, 'Er. Sameer Deshmukh (Chemistry)', 'ACTIVE']
    ],
    formulas: [
      {
        label: 'Seat Availability Check',
        formula: '=H2-I2',
        explanation: 'Returns remaining open seats by subtracting Enrolled Count (I2) from Max Capacity (H2).'
      },
      {
        label: 'Batch Occupancy Percentage',
        formula: '=(I2/H2)*100 & "%"',
        explanation: 'Computes current utilization percentage of the classroom capacity.'
      }
    ]
  },
  {
    id: 'faculty',
    name: '3. Faculty Directory',
    icon: Sparkles,
    description: 'Faculty roster, qualifications, teaching subjects, contact information, and remuneration models.',
    recommendedUse: 'Maintain teacher contact details, active batch commitments, and hourly/monthly contracts.',
    headers: [
      'Faculty_ID',
      'Full_Name',
      'Designation',
      'Primary_Subject',
      'Secondary_Subject',
      'Mobile_Number',
      'Email_Address',
      'Highest_Degree',
      'Assigned_Batches',
      'Weekly_Teaching_Hours',
      'Remuneration_Type'
    ],
    sampleRows: [
      ['FAC-01', 'Dr. Arvind Sharma', 'Head of Faculty & Senior Mentor', 'Physics', 'Applied Mechanics', '+91 98111 00001', 'arvind.sharma@coaching.edu', 'Ph.D. in Applied Physics (IIT-B)', '10A-Morning-Engg, 11-JEE-Weekend', 16, 'Fixed Monthly + Performance'],
      ['FAC-02', 'Prof. Rajesh Kulkarni', 'Senior Mathematics Specialist', 'Mathematics', 'Vedic Maths & Calculus', '+91 98111 00002', 'rajesh.k@coaching.edu', 'M.Sc. Mathematics (Gold Medalist)', '10A-Morning-Engg, 9A-Foundation-Sun', 18, 'Hourly Contract (₹1,500/hr)'],
      ['FAC-03', 'Dr. Meenakshi Sundaram', 'Biology & Botany Lead', 'Biology', 'Biotechnology', '+91 98111 00003', 'm.sundaram@coaching.edu', 'M.B.B.S., MD Physiology', '10A-Morning-Med, 12-NEET-Elite', 14, 'Fixed Monthly Retainer'],
      ['FAC-04', 'Er. Sameer Deshmukh', 'Chemistry Faculty', 'Chemistry', 'Organic Chemistry', '+91 98111 00004', 'sameer.d@coaching.edu', 'B.Tech Chemical Engg (NIT)', '10A-Morning-Engg, 11-JEE-Weekend', 15, 'Hourly Contract (₹1,400/hr)'],
      ['FAC-05', 'Mrs. Shalini Gupta', 'Foundation Coordinator', 'General Science', 'Social Studies', '+91 98111 00005', 'shalini.g@coaching.edu', 'B.Sc., B.Ed.', '8A-General-Eve, 9A-Foundation-Sun', 12, 'Fixed Monthly Retainer']
    ],
    formulas: [
      {
        label: 'Monthly Payout Estimate (Hourly Faculty)',
        formula: '=J2*4*1500',
        explanation: 'Calculates 4-week monthly remuneration based on weekly hours (J2) and hourly rate.'
      }
    ]
  },
  {
    id: 'fees',
    name: '4. Fee Collection Ledger',
    icon: CreditCard,
    description: 'Detailed installment tracking, payments, mode of transfer, transaction references, and overdue balances.',
    recommendedUse: 'Record receipt vouchers, partial payments, UPI/Cheque IDs, and track overdue installment alerts.',
    headers: [
      'Receipt_No',
      'Payment_Date',
      'Student_ID',
      'Student_Name',
      'Batch_Code',
      'Installment_No',
      'Total_Course_Fee',
      'Net_Payable',
      'Amount_Paid',
      'Balance_Due',
      'Payment_Mode',
      'Transaction_UTR_Cheque',
      'Payment_Status',
      'Next_Due_Date'
    ],
    sampleRows: [
      ['REC-2026-001', '2026-04-01', 'STU-2026-001', 'Aarav Patel', '10A-Morning-Engg', 'Installment 1 of 3', 65000, 60000, 20000, 40000, 'UPI (Google Pay)', 'UPI/412398129031', 'PARTIAL', '2026-07-01'],
      ['REC-2026-002', '2026-04-02', 'STU-2026-002', 'Diya Sharma', '10A-Morning-Med', 'Full Payment (Lump Sum)', 70000, 60000, 60000, 0, 'Net Banking (HDFC NEFT)', 'HDFCN2604029182', 'PAID', 'N/A'],
      ['REC-2026-003', '2026-04-03', 'STU-2026-003', 'Rohan Verma', '11-JEE-Weekend', 'Installment 1 of 4', 85000, 85000, 30000, 55000, 'Cheque (ICICI)', 'CHQ-892101', 'PARTIAL', '2026-06-15'],
      ['REC-2026-004', '2026-04-04', 'STU-2026-004', 'Ananya Iyer', '10B-Evening-Reg', 'Installment 1 of 2', 45000, 42000, 21000, 21000, 'UPI (PhonePe)', 'UPI/412498776612', 'PARTIAL', '2026-08-01'],
      ['REC-2026-005', '2026-04-05', 'STU-2026-005', 'Kabir Mehta', '9A-Foundation-Sun', 'Overdue Alert', 50000, 45000, 0, 45000, 'Pending', 'Awaiting Parent Wire', 'OVERDUE', '2026-04-10']
    ],
    formulas: [
      {
        label: 'Dynamic Balance Due',
        formula: '=H2-I2',
        explanation: 'Subtracts Amount Paid (Col I) from Net Fee Payable (Col H).'
      },
      {
        label: 'Auto Fee Status Categorization',
        formula: '=IF(J2<=0, "PAID", IF(I2=0, "OVERDUE", "PARTIAL"))',
        explanation: 'Automatically labels status as PAID when balance is 0, OVERDUE if zero paid, or PARTIAL.'
      },
      {
        label: 'Total Fee Collected (Summary)',
        formula: '=SUM(I2:I50)',
        explanation: 'Sums all collected amounts across the fee ledger column.'
      }
    ]
  },
  {
    id: 'attendance',
    name: '5. Daily Attendance Register',
    icon: Calendar,
    description: 'Roll-call log, punch time, attendance classification, and automated parent SMS notifications.',
    recommendedUse: 'Track student daily presence, late arrivals, excused sick leaves, and emergency notifications.',
    headers: [
      'Attendance_Date',
      'Batch_Code',
      'Student_ID',
      'Student_Name',
      'Roll_No',
      'Status',
      'Check_In_Time',
      'Marking_Mode',
      'Parent_SMS_Sent',
      'Remark_Notes'
    ],
    sampleRows: [
      ['2026-04-06', '10A-Morning-Engg', 'STU-2026-001', 'Aarav Patel', '10A-01', 'PRESENT', '06:55 AM', 'RFID Card Tap', 'YES (Sent at 06:56 AM)', 'On Time'],
      ['2026-04-06', '10A-Morning-Engg', 'STU-2026-002', 'Diya Sharma', '10A-02', 'PRESENT', '06:58 AM', 'RFID Card Tap', 'YES (Sent at 06:59 AM)', 'On Time'],
      ['2026-04-06', '10A-Morning-Engg', 'STU-2026-003', 'Rohan Verma', '10A-03', 'LATE', '07:18 AM', 'Manual Roll Call', 'YES (Late Arrival SMS)', 'Late by 18 mins (Traffic)'],
      ['2026-04-06', '10A-Morning-Engg', 'STU-2026-004', 'Ananya Iyer', '10A-04', 'ABSENT', '—', 'Teacher Portal Call', 'YES (Unexcused Absence Alert)', 'Parent called: Viral fever'],
      ['2026-04-06', '10A-Morning-Engg', 'STU-2026-005', 'Kabir Mehta', '10A-05', 'EXCUSED', '—', 'Prior Application', 'YES (Prior Approval Confirmed)', 'Attending State Science Fair']
    ],
    formulas: [
      {
        label: 'Individual Monthly Attendance Percentage',
        formula: '=(COUNTIF(F2:F31, "PRESENT") + (0.5 * COUNTIF(F2:F31, "LATE"))) / COUNTA(F2:F31) * 100',
        explanation: 'Computes monthly attendance % crediting full points for Present and half for Late arrivals.'
      },
      {
        label: 'Absentee Count for Today',
        formula: '=COUNTIF(F2:F51, "ABSENT")',
        explanation: 'Counts total students flagged absent for sending bulk guardian alerts.'
      }
    ]
  },
  {
    id: 'tests',
    name: '6. Test Series & Marks',
    icon: Award,
    description: 'Weekly test scorecards, minor tests, full-length mock exams, batch ranks, and percentiles.',
    recommendedUse: 'Record test performance, calculate batch ranks, analyze weak subjects, and generate parent scorecards.',
    headers: [
      'Test_Code',
      'Test_Date',
      'Test_Type',
      'Batch_Code',
      'Student_ID',
      'Student_Name',
      'Subject',
      'Max_Marks',
      'Marks_Obtained',
      'Percentage',
      'Batch_Rank',
      'Percentile',
      'Performance_Band'
    ],
    sampleRows: [
      ['MOCK-JEE-01', '2026-04-12', 'Minor Unit Test', '10A-Morning-Engg', 'STU-2026-001', 'Aarav Patel', 'Physics (Mechanics)', 100, 94, 94.0, 1, 98.2, 'EXEMPLARY (A+)'],
      ['MOCK-JEE-01', '2026-04-12', 'Minor Unit Test', '10A-Morning-Engg', 'STU-2026-002', 'Diya Sharma', 'Physics (Mechanics)', 100, 88, 88.0, 2, 94.5, 'DISTINCTION (A)'],
      ['MOCK-JEE-01', '2026-04-12', 'Minor Unit Test', '10A-Morning-Engg', 'STU-2026-003', 'Rohan Verma', 'Physics (Mechanics)', 100, 82, 82.0, 3, 89.1, 'VERY GOOD (B+)'],
      ['MOCK-JEE-01', '2026-04-12', 'Minor Unit Test', '10A-Morning-Engg', 'STU-2026-004', 'Ananya Iyer', 'Physics (Mechanics)', 100, 75, 75.0, 4, 82.0, 'GOOD (B)'],
      ['MOCK-JEE-01', '2026-04-12', 'Minor Unit Test', '10A-Morning-Engg', 'STU-2026-005', 'Kabir Mehta', 'Physics (Mechanics)', 100, 64, 64.0, 5, 71.4, 'AVERAGE (C)']
    ],
    formulas: [
      {
        label: 'Percentage Calculation',
        formula: '=(I2/H2)*100',
        explanation: 'Divides Marks Obtained (Col I) by Max Marks (Col H) multiplied by 100.'
      },
      {
        label: 'Auto Batch Ranking',
        formula: '=RANK.EQ(I2, $I$2:$I$21)',
        explanation: 'Ranks the student within the batch based on Marks Obtained in descending order.'
      },
      {
        label: 'Percentile Formula',
        formula: '=(COUNTIF($I$2:$I$21, "<" & I2) / COUNT($I$2:$I$21)) * 100',
        explanation: 'Computes exact percentile score relative to peer performance.'
      }
    ]
  },
  {
    id: 'inquiries',
    name: '7. Inquiries & Walk-Ins (CRM)',
    icon: PhoneCall,
    description: 'Lead management for walk-ins, phone inquiries, demo class bookings, and admission conversions.',
    recommendedUse: 'Log prospective parent calls, scheduled demo classes, assigned counselor, and conversion stages.',
    headers: [
      'Inquiry_ID',
      'Inquiry_Date',
      'Candidate_Name',
      'Parent_Name',
      'Contact_Phone',
      'Current_School',
      'Current_Grade',
      'Interested_Course',
      'Lead_Source',
      'Assigned_Counselor',
      'Next_Follow_Up',
      'Lead_Status'
    ],
    sampleRows: [
      ['INQ-2026-101', '2026-04-05', 'Tanvi Kulkarni', 'Sanjay Kulkarni', '+91 97201 11223', 'St. Xavier High School', '10th Standard', 'JEE Foundation 1-Yr', 'Walk-in / Center Visit', 'Pooja (Admissions)', '2026-04-08', 'DEMO_SCHEDULED'],
      ['INQ-2026-102', '2026-04-06', 'Aditya Joshi', 'Dr. Alok Joshi', '+91 97201 22334', 'Podar International School', '11th Standard', 'NEET 2-Yr Medical', 'Google Search & Maps', 'Rahul (Senior Counselor)', '2026-04-09', 'COUNSELING_DONE'],
      ['INQ-2026-103', '2026-04-06', 'Sneha Pillai', 'M. Pillai', '+91 97201 33445', 'Bishop Cotton School', '9th Standard', 'Junior Olympiad Math', 'Student Referral', 'Pooja (Admissions)', '2026-04-07', 'ENROLLED (Joined 9A)'],
      ['INQ-2026-104', '2026-04-07', 'Kunal Sengupta', 'B. Sengupta', '+91 97201 44556', 'Army Public School', '12th Standard', 'JEE Crash Course (Fast Track)', 'Newspaper Pamphlet', 'Rahul (Senior Counselor)', '2026-04-10', 'CONTACTED_FOLLOWUP'],
      ['INQ-2026-105', '2026-04-07', 'Priya Nambiar', 'Geeta Nambiar', '+91 97201 55667', 'Modern English Academy', '8th Standard', 'Foundation Science & Maths', 'Instagram Campaign', 'Pooja (Admissions)', '2026-04-11', 'NEW_INQUIRY']
    ],
    formulas: [
      {
        label: 'Inquiry Conversion Rate',
        formula: '=(COUNTIF(L2:L100, "*ENROLLED*") / COUNTA(L2:L100)) * 100 & "%"',
        explanation: 'Computes overall lead-to-paid-enrollment conversion percentage for the center.'
      }
    ]
  }
];

interface CoachingCenterExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoachingCenterExcelModal: React.FC<CoachingCenterExcelModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [copiedSheetId, setCopiedSheetId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSheet = COACHING_SHEETS[activeSheetIndex];

  // Utility to convert sheet headers and sample rows to CSV text
  const generateCSV = (sheet: SheetDefinition): string => {
    const headerLine = sheet.headers.map(h => `"${h}"`).join(',');
    const dataLines = sheet.sampleRows.map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    );
    return [headerLine, ...dataLines].join('\n');
  };

  // Download individual sheet CSV
  const handleDownloadSingleSheetCSV = (sheet: SheetDefinition) => {
    const csvData = generateCSV(sheet);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Coaching_Center_${sheet.id.toUpperCase()}_Template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy CSV to clipboard
  const handleCopySheetCSV = (sheet: SheetDefinition) => {
    const csvData = generateCSV(sheet);
    navigator.clipboard.writeText(csvData);
    setCopiedSheetId(sheet.id);
    setTimeout(() => setCopiedSheetId(null), 2500);
  };

  // Download All-in-One Multi-Sheet Master CSV with section breaks
  const handleDownloadAllMasterCSV = () => {
    const allSections = COACHING_SHEETS.map(sheet => {
      const banner = `=== [SHEET: ${sheet.name.toUpperCase()} - ${sheet.description}] ===`;
      const csv = generateCSV(sheet);
      return `${banner}\n${csv}\n\n`;
    }).join('\n');

    const blob = new Blob([allSections], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Coaching_Center_Full_Excel_Workbook_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Coaching Center Demo Excel Workbook</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  7 Core Sheets Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Turnkey multi-tab Excel schema for individual tuition institutes, competitive coaching & academies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadAllMasterCSV}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Download consolidated template with all 7 sheets"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Master Workbook (.csv)</span>
              <span className="sm:hidden">Download All</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sheet Selector Tabs */}
        <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-thin">
          {COACHING_SHEETS.map((sheet, idx) => {
            const Icon = sheet.icon;
            const isActive = idx === activeSheetIndex;
            return (
              <button
                key={sheet.id}
                type="button"
                onClick={() => setActiveSheetIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sheet.name}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-100">
          
          {/* Current Sheet Overview Banner */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  {currentSheet.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  • {currentSheet.headers.length} Columns Defined
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {currentSheet.description}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">Best Practice: </strong>
                {currentSheet.recommendedUse}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => handleCopySheetCSV(currentSheet)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {copiedSheetId === currentSheet.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Sheet CSV</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDownloadSingleSheetCSV(currentSheet)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .CSV</span>
              </button>
            </div>
          </div>

          {/* Tabular Demo Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>Excel Table Preview (Headers & Sample Coaching Center Records)</span>
              </h4>
              <span className="text-[11px] text-slate-400">Scroll horizontally to view all fields</span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-slate-900">
              <div className="overflow-x-auto max-h-72 scrollbar-thin">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2.5 px-3 font-mono font-bold text-[11px] text-slate-500 text-center w-12 border-r border-slate-200 dark:border-slate-700">
                        #
                      </th>
                      {currentSheet.headers.map((h, i) => (
                        <th
                          key={i}
                          className="py-2.5 px-3.5 font-bold text-[11px] whitespace-nowrap border-r border-slate-200/60 dark:border-slate-700/60 last:border-r-0"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {currentSheet.sampleRows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-mono text-center text-[10px] text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/20 border-r border-slate-200 dark:border-slate-700">
                          {rowIdx + 1}
                        </td>
                        {row.map((cell, colIdx) => (
                          <td
                            key={colIdx}
                            className="py-2.5 px-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800 last:border-r-0 font-medium"
                          >
                            {typeof cell === 'number' && cell >= 1000 ? (
                              <span className="font-mono font-bold text-slate-900 dark:text-white">
                                ₹{cell.toLocaleString('en-IN')}
                              </span>
                            ) : String(cell).includes('@') ? (
                              <span className="text-blue-600 dark:text-blue-400 font-mono text-[11px]">
                                {cell}
                              </span>
                            ) : ['ACTIVE', 'PAID', 'PRESENT', 'DEMO_SCHEDULED'].includes(String(cell)) ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                {cell}
                              </span>
                            ) : ['OVERDUE', 'ABSENT'].includes(String(cell)) ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                                {cell}
                              </span>
                            ) : ['PARTIAL', 'LATE'].includes(String(cell)) ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                {cell}
                              </span>
                            ) : (
                              <span>{cell}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recommended Excel Formulas for this Sheet */}
          {currentSheet.formulas && currentSheet.formulas.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                <span>Built-In Automated Excel Formulas for this Sheet</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentSheet.formulas.map((item, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {item.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(item.formula);
                          setCopiedSheetId(`formula-${fIdx}`);
                          setTimeout(() => setCopiedSheetId(null), 2000);
                        }}
                        className="text-[10px] text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSheetId === `formula-${fIdx}` ? (
                          <span className="text-emerald-600">Copied!</span>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Formula</span>
                          </>
                        )}
                      </button>
                    </div>
                    <code className="block p-2 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs font-bold">
                      {item.formula}
                    </code>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best Practices for Coaching Center Operations */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/30 text-xs space-y-2">
            <h5 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Implementation Tips for Coaching Center Administrators:</span>
            </h5>
            <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-200 text-[11px] leading-relaxed">
              <li>
                <strong>Data Validation Dropdowns:</strong> In Excel, select the <code>Assigned_Batch</code> and <code>Curriculum_Board</code> columns and use <em>Data → Data Validation → List</em> to prevent typos.
              </li>
              <li>
                <strong>Fee Due Date Alerts:</strong> Apply <em>Conditional Formatting</em> on <code>Next_Due_Date</code> with <code>=AND(M2="PARTIAL", N2&lt;TODAY())</code> to highlight delinquent accounts in soft red.
              </li>
              <li>
                <strong>VLOOKUP / XLOOKUP Linkage:</strong> Use <code>Student_ID</code> as the foreign key in both the Attendance and Fee sheets to automatically pull student names without manual typing.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click <strong>Download Master Workbook</strong> to get all 7 sheets, or copy individual tables.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
