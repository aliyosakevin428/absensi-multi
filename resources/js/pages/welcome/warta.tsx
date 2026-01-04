import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dateDFY } from '@/lib/utils';
import { WartaJemaat } from '@/types';
import { Download, FileText } from 'lucide-react';
import WelcomeLayout from './layouts/welcome-layout';
import SectionContainer from './layouts/section-container';

type Props = {
    warta: WartaJemaat;
};

export default function Warta({ warta }: Props) {
    const download = async () => {
        const response = await fetch(route('warta.download', warta.id));
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${warta.title}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);
    };

    return (
        <WelcomeLayout>
            <SectionContainer title="Detail Warta Jemaat" description="Informasi lengkap warta jemaat gereja">
                <div className="mb-6 space-y-2">
                    <h1 className="text-2xl leading-tight font-bold">{warta.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <Badge variant={warta.is_active ? 'default' : 'secondary'}>{warta.is_active ? 'Aktif' : 'Tidak Aktif'}</Badge>
                        <span>•</span>
                        <span>Dibuat {dateDFY(warta.created_at)}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* LEFT */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="rounded-xl border bg-background p-5">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <FileText className="h-5 w-5" />
                                Informasi Warta
                            </h2>

                            <div className="space-y-3 text-sm">
                                <InfoRow label="Judul" value={warta.title} />
                                <InfoRow label="Dibuat Oleh" value={warta.creator?.name} />
                                <InfoRow
                                    label="Status"
                                    value={
                                        <Badge variant={warta.is_active ? 'default' : 'secondary'}>{warta.is_active ? 'Aktif' : 'Tidak Aktif'}</Badge>
                                    }
                                />
                                <InfoRow label="Tanggal" value={dateDFY(warta.created_at)} />
                            </div>
                        </div>

                        <Button size="lg" className="w-full gap-2" onClick={download}>
                            <Download className="h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>

                    {/* RIGHT */}
                    {warta.file_url && (
                        <div className="overflow-hidden rounded-xl border bg-background lg:col-span-2">
                            <div className="border-b px-4 py-3 text-sm font-medium text-muted-foreground">Preview Dokumen</div>
                            <iframe src={warta.file_url} title="Preview Warta Jemaat" className="h-[75vh] w-full" />
                        </div>
                    )}
                </div>
            </SectionContainer>
        </WelcomeLayout>
    );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium">{value}</span>
        </div>
    );
}
