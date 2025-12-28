import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dateDFY } from '@/lib/utils';
import { WartaJemaat } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download, FileText } from 'lucide-react';

type Props = {
    warta: WartaJemaat;
};

export default function Show({ warta }: Props) {
    return (
        <AppLayout
            title="Detail Warta Jemaat"
            description="Informasi detail dokumen warta jemaat"
            actions={
                <Button variant="outline" asChild>
                    <Link href={route('warta-jemaat.index')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Link>
                </Button>
            }
        >
            <Head title={warta.title} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* LEFT — INFORMATION */}
                <div className="space-y-4 md:col-span-1">
                    <div className="rounded-xl border bg-background p-4">
                        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                            <FileText className="h-5 w-5" />
                            Informasi Warta
                        </h2>

                        <div className="space-y-2 text-sm">
                            <InfoRow label="Judul" value={warta.title} />

                            <InfoRow label="Status" value={warta.is_active ? <Badge>Aktif</Badge> : <Badge variant="secondary">Tidak Aktif</Badge>} />

                            <InfoRow label="Creator" value={warta.creator?.name ?? '-'} />

                            <InfoRow label="Dibuat" value={dateDFY(warta.created_at)} />

                            <InfoRow label="Terakhir update" value={dateDFY(warta.updated_at)} />
                        </div>
                    </div>

                    {/* DOWNLOAD */}
                    {warta.file_url && (
                        <div className="rounded-xl border bg-background p-4">
                            <Button className="w-full" asChild>
                                <a href={warta.file_url} target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                </a>
                            </Button>
                        </div>
                    )}
                </div>

                {/* RIGHT — PDF PREVIEW */}
                {warta.file_url && (
                    <div className="overflow-hidden rounded-xl border bg-background md:col-span-2">
                        <iframe src={warta.file_url} title="Preview Warta Jemaat" className="h-[80vh] w-full" />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

/* -------------------------------------------------------------------------- */
/*                                Helper UI                                   */
/* -------------------------------------------------------------------------- */

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="font-medium text-muted-foreground">{label}</span>
            <span className="text-right">{value}</span>
        </div>
    );
}
