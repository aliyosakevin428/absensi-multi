import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { getBestPosition, type GeoFix } from '@/lib/geolocation';
import { Attendance, Event, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { useState } from 'react';

type Props = {
    event: Event;
    attendance: Attendance | null;
    alreadyJoined: boolean;
    alreadyPresent: boolean;
    attendedAt: string | null;
    maxAccuracy?: number;
};

type Flash = { success?: string; info?: string; error?: string };

export default function ScanAttendance({ event, attendance, alreadyJoined, alreadyPresent, attendedAt, maxAccuracy = 250 }: Props) {
    const page = usePage<SharedData & { flash?: Flash }>();
    const { auth, flash } = page.props;
    const errors = page.props.errors as Record<string, string> | undefined;
    const user = auth?.user;

    const requireGps = !!event.require_gps;

    const [coords, setCoords] = useState<GeoFix | null>(null);
    const [locating, setLocating] = useState(false);
    const [geoError, setGeoError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const accuracyTooLow = !!coords && coords.accuracy > maxAccuracy;
    const canPresent = !requireGps || (!!coords && !accuracyTooLow);

    const firstError = errors && Object.values(errors).length > 0 ? Object.values(errors)[0] : null;

    const handleJoin = () => {
        router.post(route('attendance.joinByEvent', event.id), {}, { preserveScroll: true });
    };

    const handleGetLocation = async () => {
        setLocating(true);
        setGeoError(null);
        setCoords(null);

        try {
            const fix = await getBestPosition({ onProgress: setCoords });
            setCoords(fix);
        } catch (e) {
            const err = e as Partial<GeolocationPositionError> & Error;

            if (err.code === 1) {
                setGeoError('Izin lokasi ditolak. Aktifkan izin lokasi di pengaturan browser, lalu coba lagi.');
            } else if (err.code === 2) {
                setGeoError('Lokasi tidak tersedia. Nyalakan GPS/Location di perangkat.');
            } else if (err.code === 3) {
                setGeoError('Pencarian lokasi kelamaan. Coba pindah ke tempat terbuka.');
            } else {
                setGeoError(err.message || 'Gagal mengambil lokasi.');
            }
        } finally {
            setLocating(false);
        }
    };

    const handlePresent = () => {
        if (!attendance) return;

        if (requireGps && !coords) {
            setGeoError('Aktifkan lokasi dulu sebelum check-in.');
            return;
        }

        router.post(
            route('attendance.present', attendance.id),
            requireGps && coords ? { lat: coords.lat, lng: coords.lng, accuracy: coords.accuracy } : {},
            {
                preserveScroll: true,
                onStart: () => setSubmitting(true),
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <AppLayout title="Absensi Kegiatan" description="Scan QR Code Absensi">
            <div className="flex justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>{event.name}</CardTitle>
                        <CardDescription>
                            {dayjs(event.waktu_kegiatan).format('DD MMMM YYYY HH:mm')} <br />
                            {event.lokasi_kegiatan}
                            {requireGps && (
                                <span className="mt-2 block text-xs opacity-80">
                                    GPS wajib{event.radius_m ? ` (radius ${event.radius_m} m)` : ''}
                                </span>
                            )}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {flash?.success && <div className="rounded bg-green-900/30 p-3 text-green-200">{flash.success}</div>}
                        {flash?.info && <div className="rounded bg-blue-900/30 p-3 text-blue-200">{flash.info}</div>}
                        {flash?.error && <div className="rounded bg-red-900/30 p-3 text-red-200">{flash.error}</div>}
                        {firstError && <div className="rounded bg-red-900/30 p-3 text-red-200">{firstError}</div>}

                        {!event.is_active && <p className="text-center text-sm text-red-500">Kegiatan ini belum aktif atau sudah berakhir.</p>}

                        {!user && (
                            <div className="space-y-2 text-center">
                                <p className="text-sm">Silakan login untuk melakukan absensi</p>
                                <Button asChild className="w-full">
                                    <Link href={route('login')}>Login</Link>
                                </Button>
                            </div>
                        )}

                        {user && alreadyPresent && (
                            <p className="text-center text-sm font-semibold text-green-600">
                                Kamu sudah check-in ✔
                                {attendedAt && (
                                    <span className="block text-xs font-normal opacity-80">{dayjs(attendedAt).format('DD MMM YYYY HH:mm')}</span>
                                )}
                            </p>
                        )}

                        {user && attendance && event.is_active && !alreadyPresent && (
                            <div className="space-y-2">
                                {!alreadyJoined ? (
                                    <Button type="button" className="w-full" onClick={handleJoin}>
                                        Join Daftar Hadir
                                    </Button>
                                ) : (
                                    <>
                                        {requireGps && (
                                            <Button
                                                type="button"
                                                className="w-full"
                                                variant="secondary"
                                                onClick={handleGetLocation}
                                                disabled={locating}
                                            >
                                                {locating ? 'Mencari sinyal terbaik...' : coords ? 'Ulangi Lokasi' : 'Aktifkan Lokasi'}
                                            </Button>
                                        )}

                                        {geoError && <div className="text-center text-sm text-red-500">{geoError}</div>}

                                        {coords && (
                                            <div className="space-y-1 text-center text-xs">
                                                <p className="opacity-80">
                                                    Lokasi: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                                                </p>
                                                <p className={accuracyTooLow ? 'text-red-500' : 'text-green-600'}>
                                                    Akurasi: ±{Math.round(coords.accuracy)} m
                                                    {accuracyTooLow && ` (batas ${maxAccuracy} m, coba di tempat terbuka atau pakai HP)`}
                                                </p>
                                            </div>
                                        )}

                                        <Button
                                            type="button"
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            onClick={handlePresent}
                                            disabled={!canPresent || locating || submitting}
                                        >
                                            {submitting ? 'Mengirim...' : 'Hadir / Check-in'}
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}

                        {!attendance && <p className="text-center text-sm text-red-500">Absensi untuk event ini belum tersedia.</p>}
                    </CardContent>

                    <div className="flex flex-col pb-4 text-center">
                        {attendance && <p className="text-sm text-muted-foreground">Status Event: {attendance.status}</p>}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
