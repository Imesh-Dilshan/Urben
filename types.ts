import { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface Metric {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  color: string; // Tailwind text color class or hex
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string; // Hex for accent background
}

export interface Step {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // Neighborhood or Job
  quote: string;
  image: string;
}

// Public Safety Dashboard Types
export type IncidentPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'ACTIVE' | 'EN_ROUTE' | 'RESOLVED' | 'INVESTIGATING' | 'CONTAINED';
export type IncidentType = 'FIRE' | 'MEDICAL' | 'POLICE' | 'TRAFFIC' | 'HAZARD';

export interface Incident {
  id: string;
  type: IncidentType;
  priority: IncidentPriority;
  status: IncidentStatus;
  title: string;
  description: string;
  address: string;
  coordinates: { x: number; y: number }; // Percentage for mock map
  timestamp: Date;
  assignedUnits: string[];
  caller?: string;
}

export type UnitStatus = 'AVAILABLE' | 'EN_ROUTE' | 'ON_SCENE' | 'OFF_DUTY';
export type UnitType = 'POLICE' | 'FIRE' | 'AMBULANCE';

export interface EmergencyUnit {
  id: string;
  type: UnitType;
  status: UnitStatus;
  location: string;
  currentAssignment?: string; // Incident ID
  lastUpdate: Date;
}

export type AlertLevel = 'GREEN' | 'YELLOW' | 'RED';

// Incident Detail Types
export interface IncidentUpdate {
  id: string;
  timestamp: Date;
  text: string;
  source: string; // e.g., "Command", "System", "Unit-4"
  type: 'INFO' | 'ALERT' | 'STATUS_CHANGE';
}

export interface IncidentNote {
  id: string;
  timestamp: Date;
  author: string;
  content: string;
}

// Dispatch Control Types
export interface DispatchLog {
  id: string;
  incidentId: string;
  unitId: string;
  timestamp: Date;
  action: 'DISPATCHED' | 'REASSIGNED' | 'RECALLED';
}

// Alert Broadcast Types
export type AlertType = 'FIRE' | 'WEATHER' | 'POLICE' | 'MEDICAL' | 'SAFETY' | 'GENERAL';
export type AlertPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface AlertTemplate {
  id: string;
  label: string;
  message: string;
  type: AlertType;
  priority: AlertPriority;
}

export interface BroadcastLog {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  message: string;
  timestamp: Date;
  recipients: number;
  status: 'SENT' | 'PENDING' | 'FAILED';
}

// Safety Reports Types
export type ReportType = 'INCIDENT' | 'DAILY_ACTIVITY' | 'AFTER_ACTION' | 'CUSTOM';
export type ReportStatus = 'DRAFT' | 'FINAL';

export interface SafetyReport {
  id: string;
  incidentRef?: string;
  title: string;
  type: ReportType;
  author: string;
  dateCreated: Date;
  status: ReportStatus;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: ReportType;
  lastUsed: Date;
}

// Coordination Center Types
export interface ChatChannel {
  id: string;
  name: string;
  type: 'SYSTEM' | 'INCIDENT' | 'DM';
  participants: string[];
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  sender: string;
  role: string;
  text: string;
  timestamp: Date;
  isUrgent?: boolean;
}

export interface CrisisRoom {
  id: string;
  name: string;
  incidentRef: string;
  activeUsers: number;
}

// Citizen Dashboard Types
export interface CitizenIssue {
  id: string;
  title: string;
  status: 'SUBMITTED' | 'IN_PROGRESS' | 'RESOLVED';
  date: Date;
}

export interface CitizenBill {
  id: string;
  service: string;
  amount: number;
  dueDate: Date;
  status: 'DUE' | 'PAID' | 'OVERDUE';
}

export interface TransitRoute {
  id: string;
  name: string;
  status: 'ON_TIME' | 'DELAYED';
  nextArrival: string;
}

// City Admin Types
export interface AdminComplaint {
  id: string;
  title: string;
  category: string;
  status: 'UNASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  date: Date;
}

export interface SystemLog {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
}

export interface BudgetMetric {
  department: string;
  allocated: number;
  spent: number;
  [key: string]: string | number;
}

// Service Provider Types
export type TaskPriority = 'URGENT' | 'HIGH' | 'NORMAL';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface ProviderTask {
  id: string;
  title: string;
  requester: string;
  location: string;
  time: string;
  category: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface ServiceRequest {
  id: string;
  title: string;
  source: string;
  timestamp: Date;
}

export interface ProviderResource {
  id: string;
  name: string;
  count: number;
  total: number;
  status: 'AVAILABLE' | 'LOW_STOCK' | 'BUSY';
}

// System Admin Types
export interface SecurityAlert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  timestamp: Date;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
}

export interface UserAccessLog {
  id: string;
  user: string;
  ip: string;
  status: 'SUCCESS' | 'FAILED';
  timestamp: Date;
  location: string;
}

export interface SystemConfigModule {
  name: string;
  status: 'OPERATIONAL' | 'ISSUES' | 'CRITICAL' | 'MAINTENANCE';
  lastUpdated: Date;
  version: string;
}