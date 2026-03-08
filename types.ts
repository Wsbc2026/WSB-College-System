export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  photoURL?: string;
  studentId?: string;
  classId?: string;
  department?: string;
  subjects?: string[]; // Subjects taught by teacher
  responsibility?: string; // Added for staff responsibility
  assignedClasses?: string[]; // Added for classes taught by teacher
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  classId: string;
  teacherId: string;
  room?: string;
  language: 'Francophone' | 'Anglophone';
  stream: string;
}

export type StudentCategory = 'boarder' | 'day_boarder' | 'day_boarder_lunch';

export interface Student {
  id: string;
  surname: string;
  firstName: string;
  dob: string;
  studentId: string;
  birthReg: string;
  classId: string;
  stream: string;
  language: 'Francophone' | 'Anglophone';
  parentId: string;
  gender: 'male' | 'female' | 'other';
  level: 'Junior' | 'Senior';
  year: number; // 7-13
  category: StudentCategory;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  department: string;
  enrolment: number;
  academicYear: number;
  form: number;
  stream: string;
  artStream: boolean;
  sciStream: boolean;
  assistantTeacherId?: string;
}

export interface Incident {
  id: string;
  studentId: string;
  teacherId: string;
  description: string;
  date: string;
  type: 'detention' | 'punishment' | 'warning' | 'other';
  count: number;
  absentCount?: number;
  classId?: string;
  stream?: string;
  language?: string;
}

export interface SubjectResult {
  subject: string;
  grade: string;
  mark: number;
  average: number;
  position: string;
  teacherComment: string;
  teacherInitials: string;
}

export interface AcademicRecord {
  id: string;
  studentId: string;
  term: string;
  year: string;
  results: SubjectResult[];
  overallPercentage: number;
  overallPosition: string;
  gpa: number;
  overallGrade: string;
  overallComment: string;
  classTeacherComment: string;
  principalComment: string;
  detentionCount: number;
  absentCount: number;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName?: string; // Added for UI convenience
  classId?: string; // Added for UI convenience
  term: string;
  year: string;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: 'paid' | 'partial' | 'unpaid';
  dueDate?: string;
  payments: { id?: string; date: string; amount: number; method: string }[];
}

export interface Expenditure {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  supplierName?: string;
  quotationNumber?: string;
}

export interface PaymentVoucher {
  id: string;
  payeeName: string;
  payeeType: 'Ancillary Staff' | 'Teacher' | 'Other';
  description: string;
  amount: number;
  date: string;
  approvedBy: string;
  paymentMethod: string;
  referenceNumber?: string;
}

export interface FeeSettings {
  term: string;
  year: number;
  boarder: number;
  day_boarder: number;
  day_boarder_lunch: number;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  location: string;
  status: 'active' | 'maintenance' | 'retired';
  qrCode: string;
}

export interface StaffRequest {
  id: string;
  type: 'Maintenance' | 'Handy Man' | 'Boarding Master' | 'Chief Cook' | 'Material';
  department?: string;
  description: string;
  items?: { name: string; quantity: number }[];
  status: 'pending' | 'approved' | 'rejected';
  requesterId: string;
  requestDate: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  studentId: string; // Context of the message
  content: string;
  timestamp: number;
  read: boolean;
}
