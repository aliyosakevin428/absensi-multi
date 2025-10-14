import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { motion } from 'framer-motion';
import React from 'react';
import { Bar, BarChart, RectangleProps, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface ChartProps {
    data: { name: string; total: number }[];
    title: string;
    description: string;
    barHeight?: number;
    maxHeight?: number;
}

interface ChartDataItem {
    name: string;
    attendance: number;
    index: number;
}

const AnimatedBar: React.FC<RectangleProps & { index?: number }> = (props) => {
    const { fill, x, y, width, height, index = 0 } = props;

    return (
        <motion.rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fill || 'var(--chart-1)'}
            rx={8}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: width, opacity: 1 }}
            transition={{
                duration: 1,
                delay: index * 0.05,
                ease: 'easeOut',
            }}
        />
    );
};

// fungsi renderer bar (harus function biasa, bukan React.FC)
const renderAnimatedBar = (props: RectangleProps & { payload?: { index?: number } }) => {
    const { fill, x, y, width, height, payload } = props;
    const index = payload?.index ?? 0;

    return <AnimatedBar fill={fill} x={x} y={y} width={width} height={height} index={index} />;
};

export function ChartBarHorizontalUser({ data, title, description, barHeight = 40, maxHeight = 600 }: ChartProps) {
    const chartData: ChartDataItem[] = data.map((u, index) => ({
        name: u.name,
        attendance: u.total,
        index: index,
    }));

    const totalAttendance = chartData.reduce((sum, item) => sum + item.attendance, 0);

    const chartConfig: ChartConfig = {
        attendance: { label: 'Attendance', color: 'var(--chart-1)' },
    };

    const chartHeight = Math.min(chartData.length * (barHeight + 35) + 120, maxHeight);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Card className="w-full rounded-2xl shadow-md">
                <CardHeader className="pb-2">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </motion.div>
                </CardHeader>

                <CardContent className="p-4">
                    <ChartContainer config={chartConfig}>
                        <ResponsiveContainer width="100%" height={chartHeight}>
                            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 50, left: 0, bottom: 0 }} barGap={35} barSize={15}>
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
                                    tickFormatter={(value: string) => {
                                        const maxLength = 16;
                                        return value.length > maxLength ? value.substring(0, maxLength - 1) + '…' : value;
                                    }}
                                />
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="attendance" fill="var(--chart-1)" shape={renderAnimatedBar} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>

                <CardFooter className="flex flex-col items-start gap-2 pt-2 text-sm">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 2 }} transition={{ delay: 1, duration: 1 }}>
                        Total Kehadiran Semua Anggota: {totalAttendance} Kehadiran
                    </motion.div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
