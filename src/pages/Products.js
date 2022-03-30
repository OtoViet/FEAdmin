import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import FormDialog from '../components/FormAddNewProduct.js';
// material
import { Container, Stack, Typography, CircularProgress } from '@mui/material';
// components
import Page from '../components/Page';
import {
  ProductSort,
  ProductList,
  // ProductCartWidget,
  ProductFilterSidebar
} from '../components/_dashboard/products';
//
import Pagination from '../components/Pagination';
import useGetAllProduct from '../hooks/useGetAllProduct';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const [openFilter, setOpenFilter] = useState(false);
  const [pages, setPages] = useState(1);
  const [data, setData] = useState('loading');
  let [loading, products] = useGetAllProduct();
  const [productList, setProductList] = useState(null);
  const formik = useFormik({
    initialValues: {
      gender: '',
      category: '',
      colors: '',
      priceRange: '',
      rating: ''
    },
    onSubmit: () => {
      setOpenFilter(false);
    }
  });

  useEffect(() => {
    setProductList(products);
  },[products]);
  
  const handleAddNewProduct = (product) => {
    products.push(product);
    setData(Math.random());
    setProductList(products);
  };
  const { resetForm, handleSubmit } = formik;

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };
  const handleClickPagination = (value) => {
    setPages(value);
  };
  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  const handleSort = (data) => {
    products = data;
    setProductList(data);
    setData(Math.random());
  };
  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };
  if (loading) return <>
    <h2 style={{ textAlign: "center" }}>Đang tải danh sách sản phẩm/dịch vụ</h2>
    <Stack alignItems="center" mt={10}>
      <CircularProgress size={80} />
    </Stack>
  </>;

  return (
    <Page title="Sản phẩm/Dịch vụ">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Sản phẩm/ dịch vụ
        </Typography>
        <FormDialog parentCallback={handleAddNewProduct}/>
        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort products={productList} productsParent={handleSort}/>
          </Stack>
        </Stack>

        <ProductList products={productList} pages={pages} />
        {/* <ProductCartWidget /> */}
        <Pagination count={Math.ceil(productList.length/8)} onClick={handleClickPagination} />
      </Container>
    </Page>
  );
}
