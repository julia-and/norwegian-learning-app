'use client';

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Card, CardHeader } from '@/components/ui/Card';
import { useFluencyOverTime } from '@/lib/hooks/use-writing';

export function FluencyChart() {
  const data = useFluencyOverTime(30);
  const withSubmissions = data.filter(d => d.count > 0);

  if (withSubmissions.length === 0) return null;

  // Build chart data — only include days that have submissions
  // so we get a clean connected line without huge empty gaps
  const chartData = withSubmissions.map(d => ({
    date: d.date,
    fluency: Math.round(d.avgFluency * 10) / 10,
    count: d.count,
  }));

  const avg = chartData.reduce((s, d) => s + d.fluency, 0) / chartData.length;

  return (
    <Card>
      <CardHeader title="Skriveferdighet" subtitle={`${withSubmissions.length} økt${withSubmissions.length !== 1 ? 'er' : ''} de siste 30 dagene`} />
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fluencyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
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
                  `${value}/5 (${count} innlevering${count !== 1 ? 'er' : ''})`,
                  'Flyt',
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
              dataKey="fluency"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#fluencyGradient)"
              dot={{ r: 3, fill: 'var(--color-primary)', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: 'var(--color-primary)', stroke: 'white', strokeWidth: 2 }}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
