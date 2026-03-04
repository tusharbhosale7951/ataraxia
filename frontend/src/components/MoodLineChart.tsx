import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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

export const MoodLineChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="date" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip contentStyle={{ background: '#1A2A1F', border: '1px solid #333', color: 'white' }} />
        <Legend />
        <Line type="monotone" dataKey="calm" stroke={COLORS.calm} strokeWidth={2} />
        <Line type="monotone" dataKey="happy" stroke={COLORS.happy} strokeWidth={2} />
        <Line type="monotone" dataKey="neutral" stroke={COLORS.neutral} strokeWidth={2} />
        <Line type="monotone" dataKey="anxious" stroke={COLORS.anxious} strokeWidth={2} />
        <Line type="monotone" dataKey="sad" stroke={COLORS.sad} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}