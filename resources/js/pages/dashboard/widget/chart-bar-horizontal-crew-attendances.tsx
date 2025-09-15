import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

interface ChartProps {
    data: { name: string; total: number }[];
    title: string;
    description: string;
    barHeight?: number;
    maxHeight?: number;
}

export function ChartBarHorizontalUser({ data, title, description, barHeight = 40, maxHeight = 600 }: ChartProps) {
    // Gunakan nama lengkap, jangan dipotong
    const chartData = data.map((u) => ({
        name: u.name,
        attendance: u.total,
    }));

    const totalAttendance = chartData.reduce((sum, item) => sum + item.attendance, 0);

    const chartConfig: ChartConfig = {
        attendance: { label: 'Attendance', color: 'var(--chart-1)' },
    };

    // Hitung tinggi chart dengan spacing yang lebih longgar
    const chartHeight = Math.min(chartData.length * (barHeight + 35) + 120, maxHeight);

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardContent className="p-4">
                <ChartContainer config={chartConfig}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 0, right: 50, left: -10, bottom: 0 }}
                        barGap={35}
                        barSize={14}
                        height={chartHeight}
                        width={600}
                    >
                        <XAxis type="number" dataKey="attendance" domain={[0, 'dataMax + 1']} tickCount={5} tick={{ fontSize: 11 }} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={20}
                            axisLine={false}
                            width={140}
                            interval={0}
                            tick={{
                                fontSize: 13,
                                fill: '#666',
                            }}
                            tickFormatter={(value) => {
                                // Potong nama yang terlalu panjang
                                const maxLength = 16;
                                if (value.length > maxLength) {
                                    return value.substring(0, maxLength - 1) + '…';
                                }
                                return value;
                            }}
                        />
                        <ChartTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="attendance" fill="var(--chart-1)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex flex-col items-start gap-2 pt-2 text-sm">
                <div>Total Kehadiran Semua Anggota: {totalAttendance} Kehadiran</div>
            </CardFooter>
        </Card>
    );
}
