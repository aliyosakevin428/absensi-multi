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
        <Card className="rounded-2xl shadow-md">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Jumlah Event Terlaksana</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Per bulan</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        barSize={30}
                        barCategoryGap="15%" // kasih jarak antar bar
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="month" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickMargin={10} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'rgba(59,130,246,0.1)' }}
                            contentStyle={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                boxShadow: 'none',
                                fontSize: '12px',
                            }}
                            labelStyle={{ display: 'none' }}
                        />
                        <Bar dataKey="total" fill="#3b82f6" radius={8} />
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
