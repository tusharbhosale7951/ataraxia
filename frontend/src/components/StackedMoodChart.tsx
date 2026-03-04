import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Props {
  data: Array<{ date: string; calm: number; happy: number; neutral: number; anxious: number; sad: number }>
}

const COLORS = {
  calm: '#9CAF88',
  happy: '#E5D3B0',
  neutral: '#A7C7D9',
  anxious: '#F4A261',
  sad: '#E76F51'
}

export const StackedMoodChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="date" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip 
          contentStyle={{ background: '#1A2A1F', border: '1px solid #333', color: 'white' }}
          labelStyle={{ color: '#9CAF88' }}
        />
        <Legend />
        <Area type="monotone" dataKey="calm" stackId="1" stroke={COLORS.calm} fill={COLORS.calm} fillOpacity={0.6} />
        <Area type="monotone" dataKey="happy" stackId="1" stroke={COLORS.happy} fill={COLORS.happy} fillOpacity={0.6} />
        <Area type="monotone" dataKey="neutral" stackId="1" stroke={COLORS.neutral} fill={COLORS.neutral} fillOpacity={0.6} />
        <Area type="monotone" dataKey="anxious" stackId="1" stroke={COLORS.anxious} fill={COLORS.anxious} fillOpacity={0.6} />
        <Area type="monotone" dataKey="sad" stackId="1" stroke={COLORS.sad} fill={COLORS.sad} fillOpacity={0.6} />
      </AreaChart>
    </ResponsiveContainer>
  )
}