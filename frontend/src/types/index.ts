export type Risk = "High" | "Medium" | "Low";
export type Status = "Open" | "Closed" | "In Progress";

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  lastLogin: string;
  status: "Active" | "Dormant" | "Disabled";
  risk: Risk;
  isAdmin?: boolean;
  unauthorized?: boolean;
  accessRights: string[];
  observations: string[];
}

export interface SoDConflict {
  id: string;
  userId: string;
  user: string;
  conflictType: string;
  description: string;
  severity: Risk;
  status: "Active" | "Mitigated";
  detected: string;
}

export interface Vendor {
  id: string;
  name: string;
  createdDate: string;
  lastModified: string;
  riskType: string;
  risk: Risk;
  bankAccount: string;
  observations: string[];
}

export interface Payment {
  id: string;
  vendor: string;
  invoice: string;
  amount: number;
  approvalStatus: "Approved" | "Pending" | "Unauthorized";
  risk: Risk;
  date: string;
  tags: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  amount: number;
  createdBy: string;
  approvedBy: string;
  risk: Risk;
  type: "Manual" | "Automated";
  flags: string[];
  description: string;
}

export interface ERPChange {
  id: string;
  module: string;
  changeType: string;
  requestedBy: string;
  approvedBy: string;
  status: "Approved" | "Unapproved" | "Emergency";
  risk: Risk;
  date: string;
  flags: string[];
}

export interface Finding {
  id: string;
  module: string;
  observation: string;
  recommendation: string;
  risk: Risk;
  owner: string;
  status: Status;
  date: string;
}
