import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import ChartAreaEvents from './widget/chart-area-events-widget';
import { ChartBarHorizontalUser } from './widget/chart-bar-horizontal-crew-attendances';
import DateTimeWidget from './widget/date-time-widget';
import UserInfoWidget from './widget/user-info-widget';

type ChartItem = { month: string; total: number };

type DashboardPageProps = SharedData & {
    chartData: ChartItem[];
    attendancePerUser: { name: string; total: number }[];
    year: number;
    years: number[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard() {
    const {
        auth: { roles },
        chartData,
        attendancePerUser,
        year,
        years,
    } = usePage<DashboardPageProps>().props;

    const [loading, setLoading] = useState(false);

    const handleYearChange = (newYear: number) => {
        router.get(
            '/dashboard',
            { year: newYear },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                // kalau mau update hanya chart kegiatan, pakai: only: ['chartData', 'year']
                only: ['chartData', 'attendancePerUser', 'year'],
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    };

    return (
        <AppLayout title="Dashboard" description={`Selamat datang, kamu masuk sebagai ${roles.join(', ')}`} breadcrumbs={breadcrumbs}>
            {/* Container utama biar ada ruang napas */}
            <div className="space-y-6">
                {/* Header akun + jam: stack di HP, side-by-side di desktop */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                    <div className="min-w-0 lg:col-span-7">
                        <UserInfoWidget />
                    </div>
                    <div className="min-w-0 lg:col-span-5">
                        <DateTimeWidget />
                    </div>
                </div>

                {/* Stat Cards - responsif 1/2/3 kolom */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-xs text-muted-foreground">Kegiatan tahun {year}</div>
                            <div className="text-2xl font-bold">{chartData.reduce((s, c) => s + c.total, 0)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-xs text-muted-foreground">Total Kehadiran</div>
                            <div className="text-2xl font-bold">{attendancePerUser.reduce((s, c) => s + c.total, 0)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-xs text-muted-foreground">Rata-rata / bulan</div>
                            <div className="text-2xl font-bold">
                                {chartData.length ? (chartData.reduce((s, c) => s + c.total, 0) / chartData.length).toFixed(1) : 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="min-w-0 lg:col-span-7">
                        <ChartAreaEvents chartData={chartData} year={year} years={years} onYearChange={handleYearChange} loading={loading} />
                    </div>
                    <div className="min-w-0 lg:col-span-5">
                        <ChartBarHorizontalUser
                            data={attendancePerUser}
                            title="Kehadiran per anggota"
                            description="Jumlah kehadiran masing-masing anggota"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
