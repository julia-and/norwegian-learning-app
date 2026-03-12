'use client';

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Card, CardHeader } from '@/components/ui/Card';
import { useDifficultyOverTime } from '@/lib/hooks/use-difficulty-ratings';

export function DifficultyChart() {
  const data = useDifficultyOverTime(30);
  const withRatings = data.filter(d => d.count > 0);

  if (withRatings.length === 0) return null;

  const chartData = withRatings.map(d => ({
    date: d.date,
    avgRating: Math.round(d.avgRating * 10) / 10,
    count: d.count,
  }));

  const avg = chartData.reduce((s, d) => s + d.avgRating, 0) / chartData.length;

  return (
    <Card>
      <CardHeader title="Øvingsvanskelighet" subtitle={`${withRatings.length} dag${withRatings.length !== 1 ? 'er' : ''} vurdert siste 30 dager`} />
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="difficultyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-listening)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-listening)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={(d) => format(parseISO(d), 'MMM d')}
              tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
              axisLine={false}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
              axisLine={false}
              tickLine={false}
              width={20}
            />
            <ReferenceLine
              y={Math.round(avg * 10) / 10}
              stroke="var(--color-border)"
              strokeDasharray="4 4"
              label={{
                value: `snitt ${avg.toFixed(1)}`,
                position: 'right',
                fontSize: 10,
                fill: 'var(--color-text-tertiary)',
              }}
            />
            <Tooltip
              formatter={(value, _name, props) => {
                const count = (props?.payload as { count?: number })?.count ?? 0;
                return [
                  `${value}/5 (${count} vurdering${count !== 1 ? 'er' : ''})`,
                  'Vanskelighet',
                ];
              }}
              labelFormatter={(label) => format(parseISO(label as string), 'EEE, MMM d')}
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-primary)',
              }}
            />
            <Area
              type="monotone"
              dataKey="avgRating"
              stroke="var(--color-listening)"
              strokeWidth={2}
              fill="url(#difficultyGradient)"
              dot={{ r: 3, fill: 'var(--color-listening)', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: 'var(--color-listening)', stroke: 'white', strokeWidth: 2 }}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
