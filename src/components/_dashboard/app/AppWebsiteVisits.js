import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@mui/material';
//
import { BaseOptionChart } from '../../charts';
//
import useStatistical from '../../../hooks/useStatistical';
//
import { Stack, CircularProgress } from '@mui/material';
// ----------------------------------------------------------------------

export default function AppWebsiteVisits() {
  const [loading, statistical] = useStatistical();

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ],
    yaxis: {
      labels: {
        formatter: function (value) {
          return (value/1000000).toLocaleString() + "triệu";
        }
      },
    },
    xaxis: {
      tickPlacement: 'on',
      categories: [
        ['Tháng', '1'],
        ['Tháng', '2'],
        ['Tháng', '3'],
        ['Tháng', '4'],
        ['Tháng', '5'],
        ['Tháng', '6'],
        ['Tháng', '7'],
        ['Tháng', '8'],
        ['Tháng', '9'],
        ['Tháng', '10'],
        ['Tháng', '11'],
        ['Tháng', '12'],
      ]
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${(y/1000000).toLocaleString()} triệu`;
          }
          return y;
        }
      }
    }
  });
  if (loading) return <>
    <h2 style={{ textAlign: "center" }}>Đang tải thông tin</h2>
    <Stack alignItems="center" mt={10}>
      <CircularProgress size={80} />
    </Stack>
  </>;
  const CHART_DATA = [{
    name: "Doanh thu",
    data: statistical
  }];
  return (
    <Card>
      <CardHeader title="Thống kê doanh thu" subheader="Thống kê 12 tháng" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="bar" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
