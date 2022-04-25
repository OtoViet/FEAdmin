import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, CircularProgress, Container, Stack, Typography } from '@mui/material';
// components
import Pagination from '../components/Pagination';
import Page from '../components/Page';
import {
  SchedulesCard, SchedulesSort, SchedulesSearch,
  ScheduleFilterSidebar
} from '../components/_dashboard/schedules';
//
import useGetAllOrder from '../hooks/useGetAllOrder';
// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Mới Nhất' },
  { value: 'highPrice', label: 'Giá trị cao' },
  { value: 'lowPrice', label: 'Giá trị thấp' },
  { value: 'oldest', label: 'Cũ Nhất' }
];

// ----------------------------------------------------------------------

export default function Schedules() {
  const [openFilter, setOpenFilter] = useState(false);
  const [loading, orders] = useGetAllOrder();
  const [pages, setPages] = useState(1);
  const [orderList, setOrderList] = useState([]);

  const formik = useFormik({
    initialValues: {
      confirm: ''
    },
    onSubmit: (value) => {
      if (value.confirm == 'confirmed') {
        if (!loading) {
          let newOrderList = orders;
          setOrderList(newOrderList.filter(order => order.isConfirmed == true));
        }
      }
      else if (value.confirm == 'canceled') {
        let newOrderList = orders;
        setOrderList(newOrderList.filter(order => order.isCanceled == true));
      }
      else if (value.confirm == '') {
        if (!loading) {
          setOrderList(orders.sort(function (a, b) {
            let dateA = new Date(a.createdAt);
            let dateB = new Date(b.createdAt);
            if (dateA < dateB) return 1;
            if (dateA > dateB) return -1;
            return 0;
          }));
        }
      }
      else {
        if (!loading) {
          let newOrderList = orders;
          setOrderList(newOrderList.filter(order => (order.isConfirmed == false) && (order.isCanceled == false)));
        }
      }
      setOpenFilter(false);
    }
  });

  const { resetForm, handleSubmit } = formik;
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };
  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
    setOrderList(orders.sort(function (a, b) {
      let dateA = new Date(a.createdAt);
      let dateB = new Date(b.createdAt);
      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;
      return 0;
    }));
  };
  useEffect(() => {
    setOrderList(orders.sort(function (a, b) {
      let dateA = new Date(a.createdAt);
      let dateB = new Date(b.createdAt);
      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;
      return 0;
    }));
  }, [loading]);

  const handleSort = (value) => {
    let dataSort = [];
    switch (value) {
      case 'latest':
        dataSort = orderList.sort(function (a, b) {
          let dateA = new Date(a.createdAt);
          let dateB = new Date(b.createdAt);
          if (dateA < dateB) return 1;
          if (dateA > dateB) return -1;
          return 0;
        });
        break;
      case 'oldest':
        dataSort = orderList.sort(function (a, b) {
          let dateA = new Date(a.createdAt);
          let dateB = new Date(b.createdAt);
          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
          return 0;
        });
        break;
      case 'highPrice':
        dataSort = orderList.sort(function (a, b) {
          if (a.totalPrice < b.totalPrice) return 1;
          if (a.totalPrice > b.totalPrice) return -1;
          return 0;
        });
        break;
      case 'lowPrice':
        dataSort = orderList.sort(function (a, b) {
          if (a.totalPrice < b.totalPrice) return -1;
          if (a.totalPrice > b.totalPrice) return 1;
          return 0;
        });
        break;
      default:
        return;
    };
    setOrderList([...dataSort]);
  };
  const handleClickPagination = (value) => {
    setPages(value);
  };
  if (loading) return <>
    <h2 style={{ textAlign: "center" }}>Đang tải danh sách lịch hẹn</h2>
    <Stack alignItems="center" mt={10}>
      <CircularProgress size={80} />
    </Stack>
  </>;
  return (
    <Page title="Lịch hẹn">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách lịch hẹn
          </Typography>
        </Stack>
        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <SchedulesSearch orders={orderList} />
          <ScheduleFilterSidebar
            formik={formik}
            isOpenFilter={openFilter}
            onResetFilter={handleResetFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />
          <SchedulesSort options={SORT_OPTIONS}
            onSort={handleSort} />
        </Stack>
        <Grid container spacing={3}>
          {orderList.slice(pages * 12 - 12, pages * 12).map((order, index) => (
            <SchedulesCard key={order._id} order={order} index={index} />
          ))}
        </Grid>
        <Pagination count={Math.ceil(orderList.length / 12)} onClick={handleClickPagination} />
      </Container>
    </Page>
  );
}
