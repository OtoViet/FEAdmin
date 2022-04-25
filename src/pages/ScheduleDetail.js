import { useState } from 'react';
// material
import { Container, Stack, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
// react-router-dom
import { useParams } from 'react-router-dom';
// components
import Page from '../components/Page';
import Dialog from '../components/DialogNotify';
import DialogConfirm from '../components/DialogConfirm';
//
import FormApi from '../api/formApi';
import useGetOrderById from '../hooks/useGetOrderById';
import useGetNotifyByOrderId from '../hooks/useGetNotifyByOrderId';
import useGetAllStore from '../hooks/useGetAllStore.js';
// ----------------------------------------------------------------------

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Notify() {
  const params = useParams();
  const [loading, order] = useGetOrderById(params.id);
  const [loadingNotify, notify] = useGetNotifyByOrderId(params.id);
  const [loadingStore, stores] = useGetAllStore();
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [openDialogCanCelOrder, setOpenDialogCanCelOrder] = useState(false);


  const handleCloseDialog = (status) => {
    setOpen(status);
  };
  const handleClick = () => {
    setOpenDialogConfirm(true);
  };
  const handleCloseDialogConfirm = (status) => {
    setOpenDialogConfirm(status);
  };
  const handleCloseDialogConfirmCancel = (status) => {
    setOpenDialogCanCelOrder(status);
  };

  const handleClickCancel = () => {
    setOpenDialogCanCelOrder(true);
  };
  const handleAccept = (value) => {
    if (value) {
      FormApi.confirmOrder(params.id)
        .then(() => {
          setOpen(true);
          setContent('Đơn hàng đã được xác nhận');
          if (!loadingNotify) {
            if (notify.expoPushToken) {
              const message = {
                to: notify.expoPushToken,
                sound: 'default',
                title: 'Thông báo',
                body: 'Bạn có lịch hẹn vừa được xác nhận',
                data: { idOrder: params.id },
              };

              fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                mode : 'no-cors',
                headers: {
                  'Authorization': 'No Auth',
                  'Accept': 'application/json',
                  'Accept-encoding': 'gzip, deflate',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
              })
              .then((data)=>{
                console.log(data);
              })
              .catch(err=>{
                console.log(err);
              })
            }
          }
        })
        .catch(err => {
          console.log(err);
          setContent('Có lỗi xảy ra trong quá trình xác nhận lịch hẹn');
        });
    }
  };
  const handleAcceptCancel = (value) => {
    if (value) {
      FormApi.cancelOrder(params.id)
        .then(() => {
          setOpen(true);
          setContent('Lịch hẹn đã được hủy');
        })
        .catch(err => {
          console.log(err);
          setContent('Có lỗi xảy ra trong quá trình hủy lịch hẹn');
        });
    }
  };
  if (loading || loadingStore) return <>
    <h2 style={{ textAlign: "center" }}>Đang tải thông tin</h2>
    <Stack alignItems="center" mt={10}>
      <CircularProgress size={80} />
    </Stack>
  </>;
  let status = "";
  if (order.isConfirmed && order.requireCancel) status = "Khách hàng yêu cầu hủy"
  else if (order.isConfirmed) status = "Đã xác nhận"
  else if (order.isCanceled) status = "Đã hủy"
  else if (order.isCompleted) status = "Đã hoàn thành"
  else status = "Chưa xác nhận"
  return (
    <Page title="Chi tiết lịch hẹn">
      <Container>
        {open ? <Dialog open={open}
          handleCloseDialog={handleCloseDialog}
          title="Thông báo"
          url="/orders"
          content={content} /> : null}

        {openDialogConfirm ? <DialogConfirm open={openDialogConfirm}
          isAccept={handleAccept}
          handleCloseDialog={handleCloseDialogConfirm}
          title="Thông báo"
          url={"/orders"} cancel="Hủy bỏ" accept="Xác nhận"
          content={"Xác nhận lịch hẹn này?"} /> : null}

        {openDialogCanCelOrder ? <DialogConfirm open={openDialogCanCelOrder}
          isAccept={handleAcceptCancel}
          handleCloseDialog={handleCloseDialogConfirmCancel}
          title="Thông báo"
          url={"/orders"} cancel="Hủy bỏ" accept="Xác nhận"
          content={"Xác nhận hủy bỏ lịch hẹn này?"} /> : null}
        <Typography variant="h4" sx={{ mb: 5 }}>
          Chi tiết lịch hẹn
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Thông tin</StyledTableCell>
                <StyledTableCell align="right">Mô tả</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Tên người đặt
                </StyledTableCell>
                <StyledTableCell align="right">{order.contactInfo.name}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Số điện thoại liên hệ
                </StyledTableCell>
                <StyledTableCell align="right">{order.contactInfo.phoneNumber}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Địa chỉ
                </StyledTableCell>
                <StyledTableCell align="right">{order.contactInfo.address}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Yêu cầu thêm
                </StyledTableCell>
                <StyledTableCell align="right">{order.contactInfo.description}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Dịch vụ đã đặt
                </StyledTableCell>
                <StyledTableCell align="right">{
                  order.listService.map(item => item.productName + ", ")
                }</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Tổng tiền
                </StyledTableCell>
                <StyledTableCell align="right">{order.totalPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND"
                })}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Địa chỉ cửa hàng khách chọn
                </StyledTableCell>
                <StyledTableCell align="right">{stores.map(item => {
                  if (item.numOfStore == order.storeAddress) return item.address
                })}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Thanh toán
                </StyledTableCell>
                <StyledTableCell align="right">{order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Trạng thái
                </StyledTableCell>
                <StyledTableCell align="right">
                  {status}
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {
          !order.isCanceled && !order.isCompleted && !order.isConfirmed ?
            <Box textAlign="center">
              <Button variant="contained"
                onClick={handleClick}>
                Xác nhận
              </Button>
            </Box> : null
        }
        {
          order.requireCancel ?
            <Box textAlign="center">
              <Button variant="contained"
                onClick={handleClickCancel}>
                Hủy lịch hẹn
              </Button>
            </Box> : null
        }
      </Container>
    </Page>
  );
}
