'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Card, CardHeader } from '@/components/ui/Card';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { useTimeByCategory } from '@/lib/hooks/use-stats';

export function TimeChart() {
  const data = useTimeByCategory(30);

  return (
    <Card>
      <CardHeader title="Studietid" subtitle="Minutter per dag, siste 30 dager" />
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
              tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
              axisLine={false}
              tickLine={false}
              width={30}
              tickFormatter={(v) => `${v}m`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-primary)',
              }}
              labelFormatter={(label) => format(parseISO(label as string), 'EEE, MMM d')}
              formatter={(value, name) => [
                `${Number(value)} min`,
                CATEGORY_CONFIG[name as keyof typeof CATEGORY_CONFIG]?.label || name,
              ]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value: string) =>
                CATEGORY_CONFIG[value as keyof typeof CATEGORY_CONFIG]?.label || value
              }
              wrapperStyle={{ fontSize: 'var(--text-xs)' }}
            />
            <Bar dataKey="reading" stackId="a" fill={CATEGORY_CONFIG.reading.color} radius={[0, 0, 0, 0]} />
            <Bar dataKey="writing" stackId="a" fill={CATEGORY_CONFIG.writing.color} />
            <Bar dataKey="listening" stackId="a" fill={CATEGORY_CONFIG.listening.color} />
            <Bar dataKey="speaking" stackId="a" fill={CATEGORY_CONFIG.speaking.color} />
            <Bar dataKey="vocabulary" stackId="a" fill={CATEGORY_CONFIG.vocabulary.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
