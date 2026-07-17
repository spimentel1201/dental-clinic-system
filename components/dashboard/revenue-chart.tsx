'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { monthlyRevenue } from '@/lib/data'

const chartConfig = {
  ingresos: {
    label: 'Ingresos',
    color: 'var(--chart-1)',
  },
  costos: {
    label: 'Costos',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <BarChart accessibilityLayer data={monthlyRevenue}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="mes" tickLine={false} tickMargin={8} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v: number) => `S/ ${(v / 1000).toFixed(0)}k`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="ingresos" fill="var(--color-ingresos)" radius={4} />
        <Bar dataKey="costos" fill="var(--color-costos)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
