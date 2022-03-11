import { Icon } from '@iconify/react';
import { useState } from 'react';
import chevronUpFill from '@iconify/icons-eva/chevron-up-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
// material
import { Menu, Button, MenuItem, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'productNameAsc', label: 'Tên tăng dần' },
  { value: 'productNameDesc', label: 'Tên giảm dần' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'priceDesc', label: 'Giá: Thấp→Cao' },
  { value: 'priceAsc', label: 'Giá: Cao→Thấp' }
];

export default function ShopProductSort(props) {
  const [open, setOpen] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  
  const handleClose = () => {
    setOpen(null);
  };
  const handleChooseSort = (sort) => {
    setSortBy(sort);
    setOpen(null);
    switch (sort) {
      case 'productNameAsc':
        props.productsParent(props.products.sort(function (a, b) {
          if (a.productName < b.productName) return -1;
          if (a.productName > b.productName) return 1;
          return 0;
        }));
        break;
      case 'productNameDesc':
        props.productsParent(props.products.sort(function (a, b) {
          if (a.productName > b.productName) return -1;
          if (a.productName < b.productName) return 1;
          return 0;
        }));
        break;
      case 'newest':
        props.productsParent(props.products.sort(function (a, b) {
          let dateA = new Date(a.createdAt);
          let dateB = new Date(b.createdAt);
          if (dateA < dateB) return 1;
          if (dateA > dateB) return -1;
          return 0;
        }));
        return;
      case 'priceDesc':
        props.productsParent(props.products.sort(function (a, b) {
          return a.price - b.price;
        }));
        break;
        case 'priceAsc':
          props.productsParent(props.products.sort(function (a, b) {
          return b.price - a.price;
        }));
        break;
      default:
        return;
    };
  };
  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Icon icon={open ? chevronUpFill : chevronDownFill} />}
      >
        Sắp xếp theo:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {SORT_BY_OPTIONS.find(option => option.value === sortBy).label}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === sortBy}
            onClick={() => handleChooseSort(option.value)}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
