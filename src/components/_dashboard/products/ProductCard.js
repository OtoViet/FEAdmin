import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// material
import { Box, Card, Typography, Stack, Rating  } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
//
import Label from '../../Label';
// import ColorPreview from '../../ColorPreview';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  cursor: 'pointer'
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object
};

export default function ShopProductCard({ product }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/products/detail`, { state: product });
  };
  let ratingTotal = 0;
  product.rating.forEach((item) => {
    ratingTotal += item.rating;
  });
  ratingTotal = ratingTotal / product.rating.length;
  const { productName, images, price, /*colors,*/ status, priceSale } = product;
  // console.log(images);
  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase'
            }}
          >
            {status}
          </Label>
        )}
        <ProductImgStyle onClick={handleClick} alt={productName} src={images[0].url} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography color="inherit"
        component="span"
        onClick={handleClick} >
          <Typography variant="subtitle2" noWrap style={{cursor: 'pointer'}}>
            {productName}
          </Typography>
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={colors} /> */}
          <Typography
            component="span"
            variant="body1"
            sx={{
              color: 'text.disabled',
              textDecoration: 'line-through'
            }}
          >
          <Rating name="read-only" sx={{marginTop:0.3}} value={ratingTotal} precision={0.5} size="small" readOnly />

          {priceSale && fCurrency(priceSale)}
          </Typography>
          <Typography variant="subtitle1">
            &nbsp;
            {fCurrency(price)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
