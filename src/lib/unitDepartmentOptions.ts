/** Unit / department names — shared with admin user forms (`AddUser.tsx`). */
export const UNIT_DEPARTMENT_OPTIONS = [
  "President's Office",
  "VP Office for Partnerships & Development",
  "VP Office for Academic Affairs",
  "General Director of Administrative Services Office",
  "Deanship of Graduate Studies & Scientific Research",
  "Deanship of Student Affairs",
  "Deanship of Admission & Registration",
  "University Rankings Committee",
  "Governance Committee (Policies & Procedures)",
  "Quality Assurance & Accreditation Center",
  "Business Incubator Center",
  "IT & Digital Learning Directorate",
  "English Language Center",
  "Media Center",
  "Community Service & Continuing Education Center",
  "Teaching Excellence & Leadership Unit",
  "Human Resources Directorate",
  "Public Relations & Media Directorate",
  "General Services Directorate",
  "Library & Information Services Directorate",
  "Security & Safety Directorate",
  "Finance & Budget Directorate",
  "Procurement Directorate",
  "Assets & Stores Directorate",
  "Buildings & Maintenance Directorate",
  "Alumni Affairs Directorate",
  "College of Arts",
  "College of Science",
  "College of Business Administration",
  "Bahrain Teachers College (BTC)",
  "College of Applied Studies",
  "College of Information Technology",
  "College of Law",
  "College of Health & Sport Sciences",
  "College of Engineering",
] as const

export type UnitDepartment = (typeof UNIT_DEPARTMENT_OPTIONS)[number]

export const UNIT_DEPARTMENT_OPTIONS_SORTED = [...UNIT_DEPARTMENT_OPTIONS].sort((a, b) =>
  a.localeCompare(b),
)
