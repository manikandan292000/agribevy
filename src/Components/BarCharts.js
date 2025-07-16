'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

const BarCharts = ({ data, type }) => {
  console.log(data,type);
  
  // Define configurations based on chart type
  const isSales = type === 'sales';
//   const isStock = type === 'stock';

  const formattedData = data?.map(item => ({
    ...item,
    date: isSales && item.date ? format(new Date(item.date), 'MMM d') : item.veg_name,
  }));

  const currencyFormatter = value => `₹${value.toLocaleString()}`;

  return (
    <div className="w-full" style={{ height: '300px' }}>
      <h5 className="mb-2 font-semibold">
        {isSales ? 'Sales Chart' : 'Stock Chart'}
      </h5>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={isSales ? currencyFormatter : (v) => `${v} kg`}
          />
          <Tooltip
            formatter={(value) =>
              isSales ? `₹${value.toLocaleString()}` : `${value} kg`
            }
            labelFormatter={(label) =>
              isSales ? `Date: ${label}` : `Vegetable: ${label}`
            }
          />
          <Bar
            dataKey={isSales ? 'total_sales' : 'available'}
            fill={isSales ? '#4f46e5' : '#10b981'}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarCharts;
