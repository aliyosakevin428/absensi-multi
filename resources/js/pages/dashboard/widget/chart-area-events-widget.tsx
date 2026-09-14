import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

type ChartItem = { month: string; total: number };

type Props = {
    chartData: ChartItem[];
    year: number;
    years: number[];
    onYearChange: (year: number) => void;
    loading?: boolean;
};

const chartConfig = {
    total: { label: 'Kegiatan', color: 'var(--chart-1)' },
} satisfies ChartConfig;

export default function ChartAreaEvents({ chartData, year, years, onYearChange, loading }: Props) {
    const values = chartData?.map((d) => d.total) ?? [];
    const max = Math.max(5, ...(values.length ? values : [0]));
    const niceMax = Math.ceil((max + 1) / 5) * 5;

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <CardTitle className="text-lg leading-tight font-semibold">Aktivitas Kegiatan</CardTitle>
                        <CardDescription>Jumlah kegiatan yang terlaksana setiap bulan</CardDescription>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <Select value={String(year)} onValueChange={(v) => onYearChange(Number(v))} disabled={loading}>
                            <SelectTrigger className="h-9 w-[120px] rounded-xl">
                                <SelectValue placeholder="Tahun" />
                            </SelectTrigger>
                            <SelectContent align="end">
                                {[...years]
                                    .sort((a, b) => b - a)
                                    .map((y) => (
                                        <SelectItem key={y} value={String(y)}>
                                            {y}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>

                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <TrendingUp className="size-5" />
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <AreaChart data={chartData} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-total)" stopOpacity={0.35} />
                                <stop offset="100%" stopColor="var(--color-total)" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false} strokeDasharray="4 4" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
                        <YAxis
                            allowDecimals={false}
                            domain={[0, niceMax]}
                            tickCount={6}
                            tickLine={false}
                            axisLine={false}
                            width={32}
                            tick={{ fontSize: 12 }}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" labelFormatter={(label) => `Bulan ${label} ${year}`} />}
                        />

                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="var(--color-total)"
                            strokeWidth={2.5}
                            fill="url(#fillTotal)"
                            dot={false}
                            activeDot={{ r: 5 }}
                            animationDuration={600}
                            animationEasing="ease-out"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>

            <div className="border-t px-6 py-4">
                <p className="text-sm font-medium">Aktivitas kegiatan tahun {year}</p>
                <p className="mt-1 text-sm text-muted-foreground">Menampilkan jumlah kegiatan yang telah terlaksana per bulan.</p>
            </div>
        </Card>
    );
}
