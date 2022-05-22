import { useState } from 'react';
import Box from '@mui/material/Box';
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
export default function FormDialog(props) {
    const [open, setOpen] = useState(props.open);
    const [employee, setEmployee] = useState(props.employees.find(item => item._id === props.id));
    const [dialog, setDialog] = useState(false);
    const [valueDate, setValueDate] = useState(employee.dateOfBirth);

    const signUpSchema = Yup.object().shape({
        address: Yup.string().required('Vui lòng nhập địa chỉ'),
        firstName: Yup.string().required('Vui lòng nhập tên của bạn'),
        lastName: Yup.string().required('Vui lòng nhập họ của bạn'),
        phoneNumber: Yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập số điện thoại').min(100000000, 'Số điện thoại không hợp lệ'),
        dateOfBirth: Yup.date().typeError('Vui lòng chọn ngày sinh').max(new Date(), "Ngày sinh không hợp lệ"),
    });
    const handleClose = () => {
        setOpen(false);
        props.parentCallback(false);
        formik.handleReset();
    };
    
    const formik = useFormik({
        initialValues: {
            address: employee.address,
            firstName: employee.firstName,
            lastName: employee.lastName,
            phoneNumber: employee.phoneNumber,
            dateOfBirth: employee.dateOfBirth,
        },
        validationSchema: signUpSchema,
        onSubmit: (values) => {
            const EmployeeData = values;
            FormApi.updateInfoEmployee(EmployeeData,props.id).then(res => {
                props.updateUser(true);
                setEmployee(res);
                console.log(res);
                props.parentCallback(false);
                props.dataFromChild(res);
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
            {dialog ? <ResponsiveDialog open={dialog} title="Thông báo"
                content="Cập nhật thông tin cho nhân viên thành công!" /> : null}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Cập nhật thông tin nhân viên</DialogTitle>
                <DialogContent>
                    <DialogContentText mb={4} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Sửa thông tin bên dưới để cập nhật thông tin nhân viên
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
                                        required
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
                        </Grid>
                        <DialogActions>
                            <Button onClick={handleClose}>Hủy bỏ</Button>
                            <Button type="submit" >Cập nhật</Button>
                        </DialogActions>

                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}