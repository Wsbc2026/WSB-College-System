export const SCHOOL_INFO = {
  name: "White Sands Bilingual College",
  address: "065 EAST TANNA, VANAUTA",
  website: "www.wsb.edu.vu",
  emails: {
    admin: "admin@wsb.edu.vu",
    secretary: "secretary@wsb.edu.vu",
    bursar: "bursar@wsb.edu.vu"
  },
  logo: "https://lh3.googleusercontent.com/sitesv/APaQ0SR-VEda1mSlsGOUrFAErkTWFqciF1bU21qX_G68u0F3GHMFWeg8VzsZ6g2qY4Kl1d01uFvik69aqTyJGeMB-TJfxAjIb5FcQWaKmpMkk6BMlDmYYrDyEOZlAvKNPU04OcHPzYjInZzqVuhrn6VyLCFVgGraiwoDvaZ3NczoDi90CYj7Zvvn6bnW=w16383",
};

export const DEPARTMENTS = [
  'Language Department',
  'Science Department',
  'Mathematics Department',
  'Social Science Department',
  'Agriculture Department',
  'Religious Education Department',
  'IT Department',
  'Other'
] as const;

export const SUBJECTS = {
  Junior: [
    'Social Science',
    'Basic Science',
    'Mathematics',
    'Religious Education',
    'Agriculture',
    'English',
    'French as a Foreign Language'
  ],
  Senior: [
    'Social Science',
    'Biology',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Religious Education',
    'Agriculture',
    'English',
    'French',
    'Economics',
    'Accounting',
    'History',
    'Geography'
  ]
};

export const TEACHERS = [
  { name: 'Nulau Elsie', email: 'nulau@wsb.edu.vu' },
  { name: 'Pascalyne Iakoli', email: 'pascalyne@wsb.edu.vu' },
  { name: 'philip kamty', email: 'philip@wsb.edu.vu' },
  { name: 'Pouillet Tuman', email: 'pouillet@wsb.edu.vu' },
  { name: 'Principal wsbc', email: 'principal@wsb.edu.vu' },
  { name: 'secretary wsb', email: 'secretary@wsb.edu.vu' },
  { name: 'steven sawia', email: 'steven@wsb.edu.vu' },
  { name: 'Susian Atkin', email: 'susian@wsb.edu.vu' },
  { name: 'susianvuti Atkin', email: 'susianvuti@wsb.edu.vu' },
  { name: 'Taur Camille', email: 'taur@wsb.edu.vu' },
  { name: 'Wendy Narai', email: 'wendynarai@wsb.edu.vu' },
  { name: 'william Esau', email: 'william@wsb.edu.vu' },
  { name: 'yann iapum', email: 'yann@wsb.edu.vu' }
];

export const ROLES = ['admin', 'teacher', 'student', 'parent'] as const;

export const GRADING_SCALE = [
  { min: 90, max: 100, grade: 'A+', gpa: 4.0, label: 'Outstanding' },
  { min: 85, max: 89, grade: 'A', gpa: 3.5, label: 'Excellent' },
  { min: 80, max: 84, grade: 'A-', gpa: 3.5, label: 'Excellent' },
  { min: 75, max: 79, grade: 'B+', gpa: 3.0, label: 'Very Good' },
  { min: 70, max: 74, grade: 'B', gpa: 3.0, label: 'Very Good' },
  { min: 65, max: 69, grade: 'B-', gpa: 2.5, label: 'Good' },
  { min: 60, max: 64, grade: 'C+', gpa: 2.5, label: 'Good' },
  { min: 55, max: 59, grade: 'C', gpa: 2.0, label: 'Average' },
  { min: 50, max: 54, grade: 'C-', gpa: 2.0, label: 'Average' },
  { min: 40, max: 49, grade: 'D', gpa: 1.5, label: 'Satisfactory' },
  { min: 30, max: 39, grade: 'E', gpa: 1.0, label: 'Unsatisfactory' },
  { min: 20, max: 29, grade: 'E', gpa: 0.5, label: 'Below average' },
  { min: 1, max: 19, grade: 'E', gpa: 0.02, label: 'Poor' },
  { min: 0, max: 0, grade: 'E', gpa: 0, label: 'Very Poor' }
];

export const DEFAULT_FEE_SETTINGS = {
  boarder: 50000,
  day_boarder: 30000,
  day_boarder_lunch: 40000,
};
