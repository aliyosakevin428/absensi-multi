import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type ChartItem = {
    month: string;
    total: number;
};

type Props = {
    chartData: ChartItem[];
};

export default function ChartBarEvents({ chartData }: Props) {
    return (
        <Card className="w-full rounded-2xl shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-foreground">Jumlah Kegiatan Terlaksana</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Per bulan</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={25} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="month" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={10} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'rgba(59,130,246,0.1)' }}
                            contentStyle={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                boxShadow: 'none',
                                fontSize: '13px',
                            }}
                            labelStyle={{ display: 'outline' }}
                        />
                        <Bar
                            dataKey="total"
                            fill="var(--chart-1)"
                            radius={10}
                            isAnimationActive={true}
                            animationDuration={1100}
                            animationBegin={0}
                            animationEasing="ease-out"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium">
                    Berikut adalah jumlah kegiatan yang terlaksana <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-muted-foreground">Showing total completed events per month</div>
            </CardFooter>
        </Card>
    );
}
