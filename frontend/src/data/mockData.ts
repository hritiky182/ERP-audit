import type {
  User,
  Vendor,
  Payment,
  JournalEntry,
  ERPChange,
  Finding,
  SoDConflict,
  Risk,
} from "@/types";

const departments = [
  "Finance",
  "Procurement",
  "Treasury",
  "IT",
  "HR",
  "Operations",
  "Sales",
  "Audit",
];
const roles = [
  "Accountant",
  "Manager",
  "Admin",
  "Approver",
  "Analyst",
  "Controller",
  "Clerk",
  "Director",
];
const firstNames = [
  "Alex",
  "Priya",
  "Marcus",
  "Linh",
  "Sara",
  "David",
  "Aisha",
  "John",
  "Yuki",
  "Mei",
  "Carlos",
  "Nina",
  "Omar",
  "Raj",
  "Eva",
  "Liam",
  "Zara",
  "Noah",
  "Olga",
  "Pedro",
];
const lastNames = [
  "Patel",
  "Smith",
  "Chen",
  "Garcia",
  "Kim",
  "Nguyen",
  "Johnson",
  "Müller",
  "Tanaka",
  "Silva",
  "Khan",
  "Rossi",
  "Walker",
  "Hassan",
  "Brown",
];

const pick = <T>(arr: T[], i: number) => arr[i % arr.length];
const rnd = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};
const riskFor = (n: number): Risk => (n < 0.2 ? "High" : n < 0.55 ? "Medium" : "Low");

const dateStr = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};

export const mockUsers: User[] = Array.from({ length: 52 }, (_, i) => {
  const r = rnd(i + 1);
  const risk = riskFor(r);
  const isAdmin = i % 7 === 0;
  const dormant = i % 11 === 0;
  return {
    id: `USR-${String(1001 + i).padStart(4, "0")}`,
    name: `${pick(firstNames, i)} ${pick(lastNames, i * 3)}`,
    email: `${pick(firstNames, i).toLowerCase()}.${pick(lastNames, i * 3).toLowerCase()}@acme.com`,
    department: pick(departments, i),
    role: isAdmin ? "Admin" : pick(roles, i + 2),
    lastLogin: dateStr(dormant ? 180 + i : Math.floor(r * 30)),
    status: dormant ? "Dormant" : i % 19 === 0 ? "Disabled" : "Active",
    risk,
    isAdmin,
    unauthorized: i % 13 === 0,
    accessRights: [
      "GL Posting",
      "Vendor Master",
      "Payment Release",
      "Journal Entry",
      "User Admin",
    ].filter((_, idx) => (i + idx) % 3 === 0),
    observations:
      risk === "High"
        ? [
            "Excessive privileges detected",
            "Account inactive >90 days",
            "Conflicting access rights",
          ]
        : risk === "Medium"
          ? ["Periodic access review pending"]
          : ["No issues observed"],
  };
});

const conflictTypes = [
  "Vendor Creation + Payment Approval",
  "Invoice Entry + Payment Release",
  "Journal Posting + Approval",
  "User Creation + Role Assignment",
  "PO Creation + GR Posting",
];

export const mockSoDConflicts: SoDConflict[] = Array.from({ length: 28 }, (_, i) => {
  const u = mockUsers[i % mockUsers.length];
  const r = rnd(i + 11);
  return {
    id: `SOD-${String(2001 + i).padStart(4, "0")}`,
    userId: u.id,
    user: u.name,
    conflictType: pick(conflictTypes, i),
    description: `User holds combined privileges enabling ${pick(conflictTypes, i).toLowerCase()} without independent oversight.`,
    severity: riskFor(r),
    status: i % 4 === 0 ? "Mitigated" : "Active",
    detected: dateStr(i * 3),
  };
});

const vendorRiskTypes = [
  "Bank Account Changed",
  "Duplicate Bank Account",
  "Vendor Created Without Approval",
  "Vendor Created and Paid Quickly",
  "Address Mismatch",
  "Tax ID Reused",
];

export const mockVendors: Vendor[] = Array.from({ length: 42 }, (_, i) => {
  const r = rnd(i + 31);
  const risk = riskFor(r);
  return {
    id: `VEN-${String(3001 + i).padStart(4, "0")}`,
    name: `${pick(["Apex", "Nimbus", "Vertex", "Solace", "Helix", "Orion", "Pinnacle", "Quantum", "Stellar", "Atlas"], i)} ${pick(["Industries", "Logistics", "Supplies", "Holdings", "Trading", "Partners", "Services"], i * 2)}`,
    createdDate: dateStr(180 + i * 5),
    lastModified: dateStr(Math.floor(r * 60)),
    riskType: pick(vendorRiskTypes, i),
    risk,
    bankAccount: `**** ${String(1000 + i * 37).slice(-4)}`,
    observations:
      risk === "High"
        ? ["Bank account changed within 30 days of payment", "No supporting documentation"]
        : ["Standard onboarding completed"],
  };
});

const paymentTags = ["Duplicate", "Weekend Payment", "Late Night Payment", "Unauthorized Approval"];

export const mockPayments: Payment[] = Array.from({ length: 110 }, (_, i) => {
  const r = rnd(i + 71);
  const risk = riskFor(r);
  const v = mockVendors[i % mockVendors.length];
  return {
    id: `PAY-${String(4001 + i).padStart(5, "0")}`,
    vendor: v.name,
    invoice: `INV-${String(50000 + i * 7).padStart(6, "0")}`,
    amount: Math.round((1000 + r * 250000) * 100) / 100,
    approvalStatus:
      risk === "High" && i % 5 === 0 ? "Unauthorized" : i % 9 === 0 ? "Pending" : "Approved",
    risk,
    date: dateStr(i),
    tags: paymentTags.filter((_, idx) => (i + idx) % 4 === 0 && risk !== "Low"),
  };
});

const journalFlags = [
  "Manual Journal",
  "Backdated Entry",
  "No Approval",
  "Same User Posted and Approved",
];

export const mockJournals: JournalEntry[] = Array.from({ length: 105 }, (_, i) => {
  const r = rnd(i + 91);
  const risk = riskFor(r);
  const creator = mockUsers[i % mockUsers.length];
  const approver = mockUsers[(i + 3) % mockUsers.length];
  const sameUser = i % 8 === 0;
  return {
    id: `JE-${String(6001 + i).padStart(5, "0")}`,
    date: dateStr(i),
    amount: Math.round((500 + r * 800000) * 100) / 100,
    createdBy: creator.name,
    approvedBy: sameUser ? creator.name : approver.name,
    risk,
    type: i % 3 === 0 ? "Manual" : "Automated",
    flags: journalFlags.filter((_, idx) => (i + idx) % 4 === 0),
    description: pick(
      [
        "Accrual reversal — Q3",
        "Inter-company transfer adjustment",
        "Bad debt write-off",
        "Depreciation correction",
        "Revenue reclassification",
        "FX revaluation",
      ],
      i,
    ),
  };
});

const changeFlags = [
  "No Approval",
  "No Testing Evidence",
  "No Rollback Plan",
  "Direct Production Change",
];
const changeModules = ["GL", "AP", "AR", "Procurement", "Treasury", "Master Data", "Security"];

export const mockChanges: ERPChange[] = Array.from({ length: 60 }, (_, i) => {
  const r = rnd(i + 121);
  const risk = riskFor(r);
  const u = mockUsers[i % mockUsers.length];
  const approver = mockUsers[(i + 5) % mockUsers.length];
  return {
    id: `CHG-${String(7001 + i).padStart(4, "0")}`,
    module: pick(changeModules, i),
    changeType: pick(["Configuration", "Code", "Master Data", "Workflow", "Permission"], i),
    requestedBy: u.name,
    approvedBy: i % 6 === 0 ? "—" : approver.name,
    status: i % 9 === 0 ? "Emergency" : i % 6 === 0 ? "Unapproved" : "Approved",
    risk,
    date: dateStr(i * 2),
    flags: changeFlags.filter((_, idx) => (i + idx) % 4 === 0),
  };
});

const findingModules = [
  "User Access",
  "SoD",
  "Vendor",
  "Payments",
  "Journals",
  "Change Management",
];

export const mockFindings: Finding[] = Array.from({ length: 55 }, (_, i) => {
  const r = rnd(i + 151);
  const risk = riskFor(r);
  const m = pick(findingModules, i);
  return {
    id: `FND-${String(8001 + i).padStart(4, "0")}`,
    module: m,
    observation: `${m}: ${pick(
      [
        "Privileged access not reviewed within policy SLA",
        "Three-way match override without documented justification",
        "Vendor onboarded without bank verification",
        "Manual journal posted and approved by same individual",
        "Production change executed without CAB approval",
        "Dormant account retained admin rights",
      ],
      i,
    )}`,
    recommendation: pick(
      [
        "Implement quarterly access certifications and enforce SoD ruleset.",
        "Require dual approval for all overrides and retain documentation.",
        "Strengthen vendor onboarding with mandatory bank verification step.",
        "Enforce maker-checker control at workflow level.",
        "Require change advisory board sign-off prior to deployment.",
      ],
      i,
    ),
    risk,
    owner: pick(
      ["Finance Controller", "IT Security", "Procurement Head", "Treasury Lead", "Internal Audit"],
      i,
    ),
    status: i % 3 === 0 ? "Closed" : i % 5 === 0 ? "In Progress" : "Open",
    date: dateStr(i * 4),
  };
});

export const findingsTrend = Array.from({ length: 12 }, (_, i) => {
  const month = new Date();
  month.setMonth(month.getMonth() - (11 - i));
  return {
    month: month.toLocaleString("en", { month: "short" }),
    high: 3 + Math.round(rnd(i + 1) * 8),
    medium: 5 + Math.round(rnd(i + 2) * 10),
    low: 4 + Math.round(rnd(i + 3) * 7),
  };
});
