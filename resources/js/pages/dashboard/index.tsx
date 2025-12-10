import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import ChartBarEvents from './widget/chart-bar-events-widget';
import { ChartBarHorizontalUser } from './widget/chart-bar-horizontal-crew-attendances';
import DateTimeWidget from './widget/date-time-widget';
import UserInfoWidget from './widget/user-info-widget';

type ChartItem = {
    month: string;
    total: number;
};

type DashboardPageProps = SharedData & {
    chartData: ChartItem[];
    attendancePerUser: { name: string; total: number }[];
};
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const {
        auth: { roles },
        chartData,
        attendancePerUser,
    } = usePage<DashboardPageProps>().props;

    return (
        <AppLayout title="Dashboard" description={`Selamat datang, kamu masuk sebagai ${roles.join(', ')}`} breadcrumbs={breadcrumbs}>
            <div className="grid gap-6 md:grid-cols-2">
                <UserInfoWidget />
                <DateTimeWidget />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <ChartBarEvents chartData={chartData} />
                <ChartBarHorizontalUser data={attendancePerUser} title="Kehadiran per anggota" description="Jumlah kehadiran masing-masing anggota" />
            </div>
        </AppLayout>
    );
}
