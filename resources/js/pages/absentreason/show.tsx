import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { FC } from 'react';

type Props = {
    absentReason: {
        id: number;
        name: string;
    };
    users: {
        id: number;
        name: string;
        attendanceDates: string[];
    }[];
};

const ShowAbsentReason: FC<Props> = ({ absentReason, users }) => {
    return (
        <AppLayout title="Detail Absen" description="Detail alasan absen">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {absentReason.name} {users.length > 0 && `(${users.length} orang)`}
                    </CardTitle>
                    <CardDescription>Daftar anggota yang menggunakan alasan ini.</CardDescription>
                </CardHeader>

                <CardContent>
                    {users.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableCaption>Total: {users.length} anggota menggunakan alasan ini.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">#</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Tanggal Absen</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user, i) => {
                                        const maxVisible = 4; // tampilkan maksimal 3 tanggal
                                        const visibleDates = user.attendanceDates.slice(0, maxVisible);
                                        const hiddenDates = user.attendanceDates.slice(maxVisible);
                                        const hiddenCount = hiddenDates.length;

                                        return (
                                            <TableRow key={user.id}>
                                                <TableCell>{i + 1}</TableCell>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>
                                                    {user.attendanceDates.length > 0 ? (
                                                        <div className="flex flex-wrap items-center gap-1">
                                                            {visibleDates.map((date, idx) => (
                                                                <Badge key={idx} variant="secondary" className="text-xs">
                                                                    {new Date(date).toLocaleDateString('id-ID', {
                                                                        day: '2-digit',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                    })}
                                                                </Badge>
                                                            ))}

                                                            {hiddenCount > 0 && (
                                                                <TooltipProvider delayDuration={800}>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <span className="cursor-help text-xs text-muted-foreground underline decoration-dotted">
                                                                                +{hiddenCount} lainnya
                                                                            </span>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="max-w-xs text-xs">
                                                                            <p className="mb-1 font-medium">Tanggal lainnya:</p>
                                                                            <ul className="list-disc space-y-0.5 pl-4">
                                                                                {hiddenDates.map((date, idx) => (
                                                                                    <li key={idx}>
                                                                                        {new Date(date).toLocaleDateString('id-ID', {
                                                                                            day: '2-digit',
                                                                                            month: 'short',
                                                                                            year: 'numeric',
                                                                                        })}
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Belum ada anggota yang pakai alasan ini.</p>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
};

export default ShowAbsentReason;
