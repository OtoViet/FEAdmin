import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import storeIcon from '@iconify/icons-bxs/store';
import discountIcon from '@iconify/icons-bxs/discount';
// import lockFill from '@iconify/icons-eva/lock-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Trang chính',
    path: '/',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Người dùng',
    path: '/user',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Sản phẩm/ dịch vụ',
    path: '/products',
    icon: getIcon(shoppingBagFill)
  },
  {
    title: 'Danh sách lịch hẹn',
    path: '/orders',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Danh sách cửa hàng',
    path: '/storeList',
    icon: getIcon(storeIcon)
  },
  {
    title: 'Mã giảm giá',
    path: '/discount',
    icon: getIcon(discountIcon)
  },
  // {
  //   title: 'Đăng nhập',
  //   path: '/login',
  //   icon: getIcon(lockFill)
  // }
];

export default sidebarConfig;
