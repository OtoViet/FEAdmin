import { useFormik } from 'formik';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FormApi from '../api/formApi';
import * as Yup from 'yup';
import ResponsiveDialog from '../components/Dialog';
import DialogAcceptResponsive from '../components/DialogAcceptResponsive';
// material
import { styled } from '@mui/material/styles';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {
    Container, Stack, Typography, ImageList, ImageListItem, IconButton,
    Grid, TextField, Button, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function EcommerceShop(props) {
    const navigate = useNavigate();
    const [dialog, setDialog] = useState(false);
    const [contentDialog, setContentDialog] = useState(null);
    const [titleDialog, setTitleDialog] = useState(null);
    const [image, setImage] = useState([]);
    const { state } = useLocation();
    const [imageList, setImageList] = useState(state.images);
    const [isDelete, setIsDelete] = useState(false);
    const [isAccept, setAccept] = useState(false);

    const handleAcceptDelete = (status) => {
        setIsDelete(status);
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
    const handleAccept = (status) => {
        setAccept(status);
        console.log(status);
        if(status){
            FormApi.deleteProduct(state._id).then(res => {
                console.log(res);
                setDialog(true);
                setTitleDialog('Thông báo');
                setContentDialog('Xóa sản phẩm/dịch vụ thành công');
                navigate('/products');
            })
            .catch(err => {
                setTitleDialog('Thông báo');
                setContentDialog('Xóa sản phẩm/dịch vụ thất bại');
            });
        }
    };
    const handleDeleteProduct = (product) => {
        setIsDelete(true);
    };
    const formatCombo = (value) => {
        let stringCombo = '';
        value.forEach((item, index) => {
            if (index === 0) {
                stringCombo += item.comboName;
            } else {
                stringCombo += `, ${item.comboName}`;
            }
        });
        return stringCombo;
    }
    const formik = useFormik({
        initialValues: {
            productName: state.productName || '',
            price: state.price || '',
            combo: formatCombo(state.combo) || '',
            description: state.description || '',
            image: '',
        },
        validationSchema: signUpSchema,
        onSubmit: async (values) => {
            // alert(JSON.stringify(values));
            // console.log(values);
            let url = "https://api.cloudinary.com/v1_1/dq7zeyepu/image/upload";
            let file = values.image;
            let listImage = [];
            for (let it = 0; it < file.length; it++) {
                try {
                    let formData = new FormData();
                    formData.append("file", file[it]);
                    formData.append("upload_preset", "kkurekfz");
                    formData.append("folder", "products");
                    let dataRes = await fetch(url, {
                        method: "POST",
                        body: formData
                    });
                    let data = await dataRes.json();
                    listImage.push({ url: data.secure_url });

                }
                catch (error) {
                    console.log('co loi xay ra khi upload anh', error);
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
            FormApi.updateProduct(ProductData,state._id).then(res => {
                setImageList(res.images);
                setDialog(true);
                setTitleDialog('Thông báo');
                setContentDialog('Cập nhật thông tin sản phẩm/dịch vụ thành công');
            }).catch(err => {
                console.log(err);
                setDialog(true);
                setTitleDialog('Thông báo');
                setContentDialog('Có lỗi xảy ra khi cập nhật thông tin sản phẩm/dịch vụ');
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
        <Page title="Chi tiết sp/dv">
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Chi tiết sản phẩm/dịch vụ
                </Typography>
                <Typography variant="h5" sx={{ mb: 5 }}>
                    Danh sách hình ảnh sản phẩm/dịch vụ
                </Typography>
                <ImageList sx={{ width: 500, height: 350 }} cols={3} rowHeight={164}>
                    {imageList.map((item, index) => (
                        <ImageListItem key={index}>
                            <img
                                src={`${item.url}`}
                                srcSet={`${item.url}`}
                                alt={state.productName}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
                <Typography variant="h5" sx={{ mb: 5 }}>
                    Cập nhật thông tin sản phẩm/dịch vụ
                </Typography>
                <div>
                    {dialog ? <ResponsiveDialog open={dialog} title={titleDialog}
                        content={contentDialog} /> : null}
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
                            {image.length > 0 ? <Stack alignItems="center" ml={2}>
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
                        <Stack spacing={4} mt={4} direction="row">
                            <Button type="submit" variant="outlined">Cập nhật</Button>
                        </Stack>

                    </Box>
                </div>
                <Typography variant="h5" sx={{ mb: 5, mt:5 }}>
                    Xóa sản phẩm/dịch vụ
                </Typography>
                {isDelete? <DialogAcceptResponsive 
                parentAccept={handleAccept}
                parentCallbackDelete={handleAcceptDelete} open={isDelete}/> : null}

                <Button variant="contained" startIcon={<DeleteIcon />}
                onClick={handleDeleteProduct}>
                    Xóa sản phẩm/dịch vụ
                </Button>
            </Container>
        </Page>
    );
}
