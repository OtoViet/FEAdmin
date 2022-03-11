import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
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
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import FormApi from '../api/formApi';
import * as Yup from 'yup';
import ResponsiveDialog from './Dialog';
export default function FormDialog(props) {

    const [open, setOpen] = useState(false);
    const [product, setProduct] = useState(null);
    const [dialog, setDialog] = useState(false);
    const [contentDialog, setContentDialog] = useState(null);
    const [titleDialog, setTitleDialog] = useState(null);
    const [image, setImage] = useState([]);
    useEffect(() => {
        if (product) {
            return props.parentCallback(product);
        }
    }, [product]);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const Input = styled('input')({
        display: 'none',
    });
    const signUpSchema = Yup.object().shape({
        productName: Yup.string().required('Vui lòng nhập tên sp/dv'),
        combo: Yup.string().required('Vui lòng nhập combo kết hợp'),
        description: Yup.string().required('Vui lòng nhập thông tin miêu tả sản phẩm/dv'),
        price: Yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập giá tiền sp/dv'),
        image: Yup.string().required('Vui lòng chọn ảnh'),
    });
    const handleClose = () => {
        setOpen(false);
        setImage('');
        formik.handleReset();
    };
    const formik = useFormik({
        initialValues: {
            productName: '',
            price: '',
            combo: '',
            description: '',
            image: '',
        },
        validationSchema: signUpSchema,
        onSubmit: async (values) => {
            // alert(JSON.stringify(values));
            // console.log(values);
            let url = "https://api.cloudinary.com/v1_1/dq7zeyepu/image/upload";
            let file = values.image;
            let listImage = [];
            for(let it=0; it<file.length; it++){
                try{
                    let formData = new FormData();
                    formData.append("file", file[it]);
                    formData.append("upload_preset", "kkurekfz");
                    formData.append("folder", "products");
                    let dataRes = await fetch(url, {
                        method: "POST",
                        body: formData
                    });
                    let data = await dataRes.json();
                    listImage.push({url: data.secure_url});

                }
                catch(error) {
                    console.log('co loi xay ra khi upload anh',error);
                    setTitleDialog('Thông báo');
                    setContentDialog('Có lỗi xảy ra khi upload ảnh');
                };
            }
            const ProductData = values;
            let comboValues = values.combo.split(',');
            let newCombo = comboValues.map(item => {
                return {
                    comboName: item
                }
            });
            ProductData.images = listImage;
            ProductData.combo = newCombo;
            FormApi.addNewProduct(ProductData).then(res => {
                setProduct(res);
                setDialog(true);
                setOpen(false);
                setTitleDialog('Thông báo');
                setContentDialog('Thêm sản phẩm mới thành công');
            }).catch(err => {
                console.log(err);
                setDialog(true);
                setTitleDialog('Thông báo');
                setContentDialog('Có lỗi xảy ra khi thêm sản phẩm mới');
            });
        },
    });

    const handleChangeImage = (e) => {
        let arrayImages = [];
        for (let it = 0; it < e.target.files.length; it++) {
            arrayImages.push(URL.createObjectURL(e.target.files[it]));
            console.log(image);
        }
        setImage(arrayImages);
        formik.setFieldValue('image', e.target.files);
    };
    return (
        <div>
            {dialog ? <ResponsiveDialog open={dialog} title={titleDialog}
                content={contentDialog} /> : null}
            <Button
                variant="contained"
                component={RouterLink}
                to="#"
                startIcon={<Icon icon={plusFill} />}
                onClick={handleClickOpen}
            >
                Thêm sản phẩm/dịch vụ mới
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thêm sản phẩm/dịch vụ mới</DialogTitle>
                <DialogContent>
                    <DialogContentText mb={4} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Điền các thông tin bên dưới để thêm sản phẩm/dịch vụ mới
                    </DialogContentText>
                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="productName"
                                    required
                                    fullWidth
                                    id="productName"
                                    label="Tên sản phẩm"
                                    value={formik.values.productName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.productName && Boolean(formik.errors.productName)}
                                    helperText={formik.touched.productName && formik.errors.productName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="price"
                                    label="Giá tiền"
                                    name="price"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <label htmlFor="image">
                                        Tải lên ảnh SP/DV
                                        <Input accept="image/*" id="image" type="file"
                                            name="image" multiple
                                            onChange={handleChangeImage} />
                                        <IconButton color="primary" aria-label="upload picture" component="span">
                                            <CameraAltIcon onChange={handleChangeImage} />
                                        </IconButton>
                                        <div style={{ color: 'rgb(255,72,66)', fontSize: 12, marginTop: 18, marginLeft: 14 }}>{formik.touched.image && formik.errors.image}</div>
                                    </label>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="combo"
                                    label="Nhập combo kết hợp"
                                    name="combo"
                                    value={formik.values.combo}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.combo && Boolean(formik.errors.combo)}
                                    helperText={formik.touched.combo && formik.errors.combo}
                                />
                            </Grid>
                            {image.length>0 ? <Stack alignItems="center" ml={2}>
                                <ImageList sx={{ width: 550, height: 500 }} cols={3} rowHeight={164}>
                                    {image.map((item, index) => (
                                        <ImageListItem key={index}>
                                        <img
                                            src={`${item}`}
                                            srcSet={`${item}`}
                                            alt={`Hinh anh ${index}`}
                                            loading="lazy"
                                        />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </Stack> : null}
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id="description"
                                    label="Nhập mô tả sản phẩm"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>
                        </Grid>
                        <DialogActions>
                            <Button onClick={handleClose}>Hủy bỏ</Button>
                            <Button type="submit" >Thêm mới</Button>
                        </DialogActions>

                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}