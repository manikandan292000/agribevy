'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

const AreaCharts = ({ data }) => {
  const formattedData = data?.map(item => ({
    ...item,
    date: format(new Date(item.date), 'MMM d'),
  }));

  const currencyFormatter = value => `₹${value.toLocaleString()}`;

  return (
    <div className="w-full" style={{height:"300px"}}>
        <h5>Profit Chart</h5>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="profitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={currencyFormatter} />
          <Tooltip
            formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
            labelFormatter={label => `Date: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#34d399"
            fillOpacity={1}
            fill="url(#profitColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaCharts;
