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
    items?: NavItem[];
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
    my_absent_reason_id?: number | null;
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
    attendances?: Attendance[];
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
    qr_token: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type Attendance = {
    id: number;
    users: (User & {
        my_absent_reason_id?: number | null;
        attended_at?: string | null;
    })[];
    event: Event;
    status: string;
    absent_reason: AbsentReason;
    media: Media[];
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

export type News = {
    id: number;
    title: string;
    slug: string;
    content: string;
    description: string;
    user_id: number;
    user: User;
    thumbnail: string;
    media: Media[];
    created_at: string;
    updated_at?: string;
};

export type WartaJemaat = {
    id: number;
    title: string;
    file_url: string;
    is_active: boolean;
    creator: User | null;
    created_at: string;
    updated_at: string;
};

export type Media = {
    id: number;
    collection_name: string;
    name: string;
    file_name: string;
    mime_type: string;
    disk: string;
    conversions_disk: string;
    size: number;
    order_column: number;
    created_at: string;
    updated_at: string;
    original_url: string;
    preview_url: string;
};
