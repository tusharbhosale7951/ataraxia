import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: Array<{ date: string; minutes: number }>
}

export const ScreenBarChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="date" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip contentStyle={{ background: '#1A2A1F', border: '1px solid #333', color: 'white' }} />
        <Bar dataKey="minutes" fill="#9CAF88" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}