'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { treatmentDistribution } from '@/lib/data'

const chartConfig = {
  cantidad: {
    label: 'Tratamientos',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

export function TreatmentsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <BarChart
        accessibilityLayer
        data={treatmentDistribution}
        layout="vertical"
        margin={{ left: 8 }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis
          dataKey="tratamiento"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          width={90}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="cantidad" fill="var(--color-cantidad)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
