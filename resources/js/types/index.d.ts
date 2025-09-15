import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    roles: string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    available?: boolean;
}

export type FormPurpose = 'create' | 'edit' | 'duplicate';

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    permissions?: Record<string, boolean>;
    settings?: Record<string, string>;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    kontak: string;
    team: Team;
    positions: Position[];
    avatar?: string;
    roles?: string[];
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type Team = {
    id: number;
    name: string;
    users: User[];
    created_at: string;
    updated_at: string;
};

export type Position = {
    id: number;
    name: string;
    users: User[];
    created_at: string;
    updated_at: string;
};

export type AbsentReason = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
};

export type EventType = {
    id: number;
    name: string;
    events?: Event[];
    created_at: string;
    updated_at: string;
};

export type Event = {
    id: number;
    name: string;
    waktu_kegiatan: string;
    lokasi_kegiatan: string;
    event_types: EventType;
    attendances: Attendance[];
};

export type Attendance = {
    id: number;
    users: User[];
    event: Event;
    status: string;
    absent_reason: AbsentReason;
};

export type Permission = {
    id: number;
    name: string;
    group: string;
    created_at: string;
    updated_at: string;
};

export type Role = {
    id: number;
    name: string;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
};
