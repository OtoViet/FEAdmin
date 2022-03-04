import { useState } from 'react';
import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import FormApi from '../api/formApi';
import * as Yup from 'yup';
import ResponsiveDialog from './Dialog';
export default function FormDialog() {
    const [open, setOpen] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [valueDate, setValueDate] = useState(new Date('2000-08-18T21:11:54'));
    const handleClickOpen = () => {
        setOpen(true);
    };
    const signUpSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email không hợp lệ')
            .required('Vui lòng nhập email')
            .test('Unique Email', 'Email đã tồn tại', // <- key, message
                function (value) {
                    return new Promise((resolve, reject) => {
                        FormApi.existAccount({ email: value }).then(res => {
                            if (res.exist) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        })
                            .catch(err => {
                                console.log(err);
                                reject(err);
                            });
                    })
                }
            ),
        address: Yup.string().required('Vui lòng nhập địa chỉ'),
        password: Yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        rePassword: Yup.string().required('Vui lòng nhập lại mật khẩu').oneOf([Yup.ref('password')], 'Mật khẩu không trùng khớp'),
        firstName: Yup.string().required('Vui lòng nhập tên của bạn'),
        lastName: Yup.string().required('Vui lòng nhập họ của bạn'),
        phoneNumber: Yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập số điện thoại').min(100000000, 'Số điện thoại không hợp lệ'),
        dateOfBirth: Yup.date().typeError('Vui lòng chọn ngày sinh').max(new Date(), "Ngày sinh không hợp lệ"),
    });
    const handleClose = () => {
        setOpen(false);
        formik.handleReset();
    };
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rePassword: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dateOfBirth: '',
        },
        validationSchema: signUpSchema,
        onSubmit: (values) => {
            const EmployeeData = values;
            FormApi.createEmployeeAccount(EmployeeData).then(res => {
                console.log(res);
                setDialog(true);
                setOpen(false);
            }).catch(err => {
                console.log(err);
            });
        },
    });
    const handleChangeDate = (newValue) => {
        setValueDate(newValue);
        formik.setFieldValue('dateOfBirth', newValue);
    };
    return (
        <div>
            {dialog? <ResponsiveDialog open={dialog} title="Thông báo"
                    content="Đăng kí tài khoản mới cho nhân viên thành công!" /> :null}
            <Button
                variant="contained"
                component={RouterLink}
                to="#"
                startIcon={<Icon icon={plusFill} />}
                onClick={handleClickOpen}
            >
                Tạo tài khoản mới
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Tạo tài khoản mới</DialogTitle>
                <DialogContent>
                    <DialogContentText mb={4} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Điền các thông tin bên dưới để tạo tài khoản nhân viên mới
                    </DialogContentText>
                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="family-name"
                                    name="lastName"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Họ"
                                    autoFocus
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="Tên"
                                    name="firstName"
                                    autoComplete="given-name"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        label="Ngày sinh"
                                        inputFormat="dd/MM/yyyy"
                                        value={valueDate}
                                        onChange={handleChangeDate}
                                        onBlur={formik.handleBlur}
                                        renderInput={(params) => <TextField {...params}
                                            name="dateOfBirth"
                                            id="dateOfBirth"
                                            error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                                            helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                                            required fullWidth />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="phoneNumber"
                                    label="Nhập số điện thoại"
                                    name="phoneNumber"
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id="address"
                                    label="Nhập địa chỉ nhân viên"
                                    name="address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Nhập địa chỉ email"
                                    name="email"
                                    autoComplete="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Nhập mật khẩu"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="rePassword"
                                    label="Nhập lại mật khẩu"
                                    type="password"
                                    id="rePassword"
                                    autoComplete="new-password"
                                    value={formik.values.rePassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.rePassword && Boolean(formik.errors.rePassword)}
                                    helperText={formik.touched.rePassword && formik.errors.rePassword}
                                />
                            </Grid>
                        </Grid>
                        <DialogActions>
                            <Button onClick={handleClose}>Hủy bỏ</Button>
                            <Button type="submit" >Đăng kí</Button>
                        </DialogActions>

                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}