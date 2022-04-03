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
//
import useGetOrderById from '../hooks/useGetOrderById';
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
  const [loadingStore, stores] = useGetAllStore();

  if (loading || loadingStore) return <>
    <h2 style={{ textAlign: "center" }}>Đang tải thông tin</h2>
    <Stack alignItems="center" mt={10}>
      <CircularProgress size={80} />
    </Stack>
  </>;
  let status = "";
  if (order.isConfirmed) status = "Đã xác nhận"
  else if (order.isCanceled) status = "Đã hủy"
  else if (order.isCompleted) status = "Đã hoàn thành"
  else status = "Chưa xác nhận"
  return (
    <Page title="Chi tiết lịch hẹn">
      <Container>
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
                <StyledTableCell align="right">{stores.map(item=>{
                  if(item.numOfStore == order.storeAddress) return item.address
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
            <Button variant="contained">
              Xác nhận
            </Button>
          </Box>: null
        }
      </Container>
    </Page>
  );
}
