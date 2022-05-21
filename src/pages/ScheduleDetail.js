import { useState, useEffect } from 'react';
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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
import useGetAllEmployee from '../hooks/useGetAllEmployee.js';
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
  const [loading, orderGet] = useGetOrderById(params.id);
  const [order, setOrder] = useState(null);
  const [loadingNotify, notify] = useGetNotifyByOrderId(params.id);
  const [loadingStore, stores] = useGetAllStore();
  const [loadingEmployees, employees] = useGetAllEmployee();
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [openDialogComplete, setOpenDialogComplete] = useState(false);
  const [openDialogUpdatePaid, setOpenDialogUpdatePaid] = useState(false);
  const [openDialogSetEmployee, setOpenDialogSetEmployee] = useState(false);
  const [openDialogCancelSetEmployee, setOpenDialogCancelEmployee] = useState(false);
  const [open, setOpen] = useState(false);
  const [openNotRedirect, setOpenNotRedirect] = useState(false);
  const [content, setContent] = useState('');
  const [contentNotRedirect, setContentNotRedirect] = useState('');
  const [openDialogCanCelOrder, setOpenDialogCanCelOrder] = useState(false);
  const [employeeSelect, setEmployeeSelect] = useState('');

  const handleChange = (event) => {
    setEmployeeSelect(event.target.value);
  };

  useEffect(() => {
    // if (!loading && Object.keys(orderGet).length > 0) {
    // console.log(orderGet);
    setOrder(orderGet);
    // }
  }, [orderGet]);

  const handleCloseDialog = (status) => {
    setOpenNotRedirect(status);
  };
  const handleCloseDialogNotRedirect = (status) => {
    setOpenNotRedirect(status);
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
  const handleCloseDialogPaid = (status) => {
    setOpenDialogUpdatePaid(status);
  };
  const handleCloseDialogSetEmployee = (status) => {
    setOpenDialogSetEmployee(status);
  };
  const handleCloseDialogCancelSetEmployee = (status) => {
    setOpenDialogCancelEmployee(status);
  };
  const handleCloseDialogComplete = (status) => {
    setOpenDialogComplete(status);
  };
  const handleClickCancel = () => {
    setOpenDialogCanCelOrder(true);
  };
  const handleClickUpdatePaid = () => {
    setOpenDialogUpdatePaid(true);
  };
  const handleClickSetEmployee = () => {
    setOpenDialogSetEmployee(true);
  };
  const handleClickCancelSetEmployee = () => {
    setOpenDialogCancelEmployee(true);
  };
  const handleClickComplete = () => {
    setOpenDialogComplete(true);
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
                mode: 'no-cors',
                headers: {
                  'Authorization': 'No Auth',
                  'Accept': 'application/json',
                  'Accept-encoding': 'gzip, deflate',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
              })
                .then((data) => {
                  console.log(data);
                })
                .catch(err => {
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
  const handleAcceptPaid = (value) => {
    if (value) {
      FormApi.updateOrder({ "isPaid": true }, params.id)
        .then((res) => {
          setOpenNotRedirect(true);
          setOrder(res);
          setContentNotRedirect('Đã xác nhận thanh toán cho lịch hẹn này');
        })
        .catch(err => {
          console.log(err);
          setContentNotRedirect('Có lỗi xảy ra khi xác nhận thanh toán cho lịch hẹn này');
        });
    }
  };

  const handleAcceptSetEmployee = (value) => {
    if (value) {
      let employeeInfo = {};
      employeeInfo._id = employeeSelect._id;
      employeeInfo.name = employeeSelect.fullName;
      employeeInfo.phoneNumber = employeeSelect.phoneNumber;
      employeeInfo.email = employeeSelect.email;

      FormApi.setEmployeeForOrder(employeeInfo, order._id).then((res) => {
        setOrder(res);
        setOpenNotRedirect(true);
        setContentNotRedirect('Đã giao lịch hẹn cho nhân viên ' + employeeSelect.fullName);
        if (!loadingNotify) {
          if (notify.expoPushToken) {
            const message = {
              to: notify.expoPushToken,
              sound: 'default',
              title: 'Thông báo',
              body: 'Bạn vừa được giao một lịch hẹn mới!',
              data: { idOrder: params.id },
            };

            fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              mode: 'no-cors',
              headers: {
                'Authorization': 'No Auth',
                'Accept': 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(message),
            })
              .then((data) => {
                console.log(data);
              })
              .catch(err => {
                console.log(err);
              })
          }
        }
      })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleAcceptCancelSetEmployee = (value) => {
    if (value) {
      let employeeInfo = {};
      FormApi.setEmployeeForOrder(employeeInfo, order._id).then((res) => {
        setOrder(res);
        setOpenNotRedirect(true);
        setContentNotRedirect('Đã hoàn tác thành công!');
        if (!loadingNotify) {
          if (notify.expoPushToken) {
            const message = {
              to: notify.expoPushToken,
              sound: 'default',
              title: 'Thông báo',
              body: 'Bạn có một lịch hẹn vừa được quản lí hoàn tác!',
              data: { idOrder: params.id },
            };

            fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              mode: 'no-cors',
              headers: {
                'Authorization': 'No Auth',
                'Accept': 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(message),
            })
              .then((data) => {
                console.log(data);
              })
              .catch(err => {
                console.log(err);
              })
          }
        }
      })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleComplete = (value) => {
    if (value) {
      FormApi.updateOrder({ "isCompleted": true }, params.id)
        .then((res) => {
          setOpenNotRedirect(true);
          setOrder(res);
          setContentNotRedirect('Đã hoàn thành lịch hẹn này');
        })
        .catch(err => {
          console.log(err);
          setContentNotRedirect('Có lỗi xảy ra khi hoàn thành lịch hẹn này');
        });
    }
  };

  if (loading || loadingStore || loadingNotify || loadingEmployees) return <>
    <h2 style={{ textAlign: "center" }}>Đang tải thông tin</h2>
    <Stack alignItems="center" mt={10}>
      <CircularProgress size={80} />
    </Stack>
  </>;
  let status = "";
  if (order.isConfirmed && order.requireCancel) status = "Khách hàng yêu cầu hủy";
  else if (order.isConfirmed && !order.isCompleted) status = "Đã xác nhận";
  else if (order.isCanceled) status = "Đã hủy";
  else if (order.isCompleted) status = "Đã hoàn thành";
  else status = "Chưa xác nhận";

  return (
    <Page title="Chi tiết lịch hẹn">
      <Container>
        {open ? <Dialog open={open}
          handleCloseDialog={handleCloseDialog}
          title="Thông báo"
          url="/orders"
          content={content} /> : null}

        {openNotRedirect ? <Dialog open={openNotRedirect}
          handleCloseDialog={handleCloseDialogNotRedirect}
          title="Thông báo"
          content={contentNotRedirect} /> : null}

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

        {openDialogUpdatePaid ? <DialogConfirm open={openDialogUpdatePaid}
          isAccept={handleAcceptPaid}
          handleCloseDialog={handleCloseDialogPaid}
          title="Thông báo" cancel="Hủy bỏ" accept="Xác nhận"
          content={"Xác nhận đã thanh toán cho lịch hẹn này?"} /> : null}

        {openDialogSetEmployee ? <DialogConfirm open={openDialogSetEmployee}
          isAccept={handleAcceptSetEmployee}
          handleCloseDialog={handleCloseDialogSetEmployee}
          title="Thông báo" cancel="Hủy bỏ" accept="Xác nhận"
          content={"Giao lịch hẹn này cho " + employeeSelect.fullName} /> : null}

        {openDialogCancelSetEmployee ? <DialogConfirm open={openDialogCancelSetEmployee}
          isAccept={handleAcceptCancelSetEmployee}
          handleCloseDialog={handleCloseDialogCancelSetEmployee}
          title="Thông báo" cancel="Hủy bỏ" accept="Xác nhận"
          content={"Lịch hẹn này đã được giao cho " + order.employeeInfo.name+' bạn có muốn hoàn tác?'} /> : null}

        {openDialogComplete ? <DialogConfirm open={openDialogComplete}
          isAccept={handleComplete}
          handleCloseDialog={handleCloseDialogComplete}
          title="Thông báo"
          url={"/orders"} cancel="Hủy bỏ" accept="Xác nhận"
          content={"Hoàn thành lịch hẹn này?"} /> : null}

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
                  Mã lịch hẹn
                </StyledTableCell>
                <StyledTableCell align="right">{order._id}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Thời gian đặt
                </StyledTableCell>
                <StyledTableCell align="right">{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date(order.createdAt))}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Thời gian hẹn
                </StyledTableCell>
                <StyledTableCell align="right">{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date(order.dateAppointment))}</StyledTableCell>
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
              {
                order.combo ?
                  <StyledTableRow >
                    <StyledTableCell component="th" scope="row">
                      Gói combo
                    </StyledTableCell>
                    <StyledTableCell align="right">{
                      order.combo
                    }</StyledTableCell>
                  </StyledTableRow> : null
              }
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
                  if (item.numOfStore === order.storeAddress) return item.address;
                  return null;
                })}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Thanh toán
                </StyledTableCell>
                <StyledTableCell align="right">{order.isPaid ? "Đã thanh toán" :
                  order.isCanceled ? "Chưa thanh toán" :
                    <>
                      Chưa thanh toán
                      <Button variant="contained"
                        style={{ marginLeft: 20 }}
                        onClick={handleClickUpdatePaid}>
                        Xác nhận thanh toán
                      </Button>
                    </>}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row">
                  Trạng thái
                </StyledTableCell>
                <StyledTableCell align="right">
                  {status}
                </StyledTableCell>
              </StyledTableRow>
              {
                order.employeeInfo ?
                  <>
                    <StyledTableRow >
                      <StyledTableCell component="th" scope="row">
                        Nhân viên phục vụ
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {order.employeeInfo.name}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow >
                      <StyledTableCell component="th" scope="row">
                        Số điện thoại nhân viên
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {order.employeeInfo.phoneNumber}
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow >
                      <StyledTableCell component="th" scope="row">
                        Email nhân viên
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {order.employeeInfo.email}
                      </StyledTableCell>
                    </StyledTableRow>
                  </>
                  : null
              }
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
        {
          order.isConfirmed && order.isPaid && !order.isCompleted ?
            <Box textAlign="center">
              <Button variant="contained"
                onClick={handleClickComplete}>
                Hoàn thành lịch hẹn
              </Button>
            </Box> : null
        }
        {order.isConfirmed && !order.employeeInfo ?
          <>
            <Typography variant="h4" sx={{ mb: 4 }}>Nhân viên phụ trách lịch hẹn</Typography>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Chọn nhân viên phụ trách</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={employeeSelect}
                  label="Chọn nhân viên phụ trách"
                  onChange={handleChange}
                >
                  {
                    employees.map(item => {
                      return <MenuItem key={item._id} value={item}>{item.fullName} ({item.email})</MenuItem>
                    })
                  }
                </Select>
                {
                  employeeSelect ?
                    <Button variant="contained"
                      sx={{ mt: 4 }}
                      onClick={handleClickSetEmployee}>
                      Xác nhận chọn nhân viên này
                    </Button> : null
                }
              </FormControl>
            </Box>
          </>
          : null}
        {order.isConfirmed && order.employeeInfo && !order.isCompleted ?
          <Button variant="contained"
            sx={{ mt: 4 }}
            onClick={handleClickCancelSetEmployee}>
            Hoàn tác giao lịch hẹn
          </Button>
          : null}
      </Container>
    </Page>
  );
}
