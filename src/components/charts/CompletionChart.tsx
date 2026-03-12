'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Card, CardHeader } from '@/components/ui/Card';
import { useCompletionByDay } from '@/lib/hooks/use-stats';

export function CompletionChart() {
  const { data } = useCompletionByDay(30);

  return (
    <Card>
      <CardHeader title="Daglig fullføring" subtitle="Siste 30 dager" />
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={data} barSize={8}>
            <XAxis
              dataKey="date"
              tickFormatter={(d) => format(parseISO(d), 'd')}
              tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
              axisLine={false}
              tickLine={false}
              interval={4}
            />
            <YAxis
              domain={[0, 1]}
              tickFormatter={(v) => `${Math.round(v * 100)}%`}
              tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              formatter={(value) => [`${Math.round(Number(value) * 100)}%`, 'Fullføring']}
              labelFormatter={(label) => format(parseISO(label as string), 'EEE, MMM d')}
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-primary)',
              }}
            />
            <Bar dataKey="rate" radius={[4, 4, 0, 0]} animationDuration={800}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.rate === 1 ? 'var(--color-success)' : entry.rate > 0 ? 'var(--color-primary)' : 'var(--color-border)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
