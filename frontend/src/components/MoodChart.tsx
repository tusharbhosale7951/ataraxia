import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#9CAF88', '#E5D3B0', '#A7C7D9', '#F4A261', '#E76F51']

interface MoodChartProps {
  data: { mood: string; note?: string; createdAt?: string; id?: string }[]
}

export const MoodChart = ({ data }: MoodChartProps) => {
  // Count occurrences of each mood
  const counts = data.reduce((acc, item) => {
    acc[item.mood] = (acc[item.mood] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.keys(counts).map(key => ({
    name: key,
    value: counts[key]
  }))

  if (chartData.length === 0) return null

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#1A2A1F',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'white'
            }}
            itemStyle={{ color: 'white' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}