import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Box, Card, CardHeader } from '@mui/material';
// utils
// import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';
//
import useStatisticalLast7Days from '../../../hooks/useGetStatistialLast7days';
//
import { Stack, CircularProgress } from '@mui/material';
// ----------------------------------------------------------------------

export default function AppConversionRates() {
  const [loading, statisticalLast7Days] = useStatisticalLast7Days();
  const chartOptions = merge(BaseOptionChart(), {
    // tooltip: {
    //   marker: { show: false },
    //   y: {
    //     formatter: (seriesName) => fNumber(seriesName),
    //     title: {
    //       formatter: (seriesName) => `${seriesName}`
    //     }
    //   }
    // },

    plotOptions: {
      bar: { horizontal: true, barHeight: '60%', borderRadius: 2 }
    },
    xaxis: {
      categories: [
        'Cách đây 1 ngày',
        'Cách đây 2 ngày',
        'Cách đây 3 ngày',
        'Cách đây 4 ngày',
        'Cách đây 5 ngày',
        'Cách đây 6 ngày',
        'Cách đây 7 ngày',
      ],
      labels: {
        formatter: function (value) {
          return (value / 1000000).toLocaleString() + "triệu";
        }
      },
    },
    
    tooltip: {
      shared: true,
      marker: { show: false },
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
  const CHART_DATA = [{ name: "Doanh thu",data: statisticalLast7Days }];
  return (
    <Card>
      <CardHeader title="Doanh thu 7 ngày gần nhất" subheader="Dữ liệu được cập nhật liên tục" />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
