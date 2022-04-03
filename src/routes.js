import { useEffect, useRef } from 'react';
import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Schedules from './pages/Schedules';
import User from './pages/User';
import NotFound from './pages/Page404';
import ProductDetail from './pages/ProductDetail';
import FormApi from './api/formApi';
import StoreList from './pages/StoreList';
import Discount from './pages/Discount';
import Notify from './pages/NotifyList';
import SchedulesDetail from './pages/ScheduleDetail';
// ----------------------------------------------------------------------

const routeNotAdmin = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
    children: [
      { path: '', element: <DashboardApp /> },
      { path: 'user', element: <User /> },
      { path: 'products', element: <Products /> },
      { path: 'orders', element: <Schedules /> },
      { path: 'orders/order/:id', element: <SchedulesDetail /> },
      { path: 'storeList', element: <StoreList /> },
      { path: 'discount', element: <Discount /> },
      { path: 'notifications', element: <Notify /> },
    ]
  },
  {
    path: '/',
    element: <LogoOnlyLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/login" /> }
    ]
  },
  { path: '*', element: <Navigate to="/login" replace /> }
];
//
const routeAdmin = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: '', element: <DashboardApp /> },
      { path: 'user', element: <User /> },
      { path: 'products', element: <Products /> },
      { path: 'products/detail', element: <ProductDetail /> },
      { path: 'orders', element: <Schedules /> },
      { path: 'orders/order/:id', element: <SchedulesDetail /> },
      { path: 'storeList', element: <StoreList /> },
      { path: 'discount', element: <Discount /> },
      { path: 'notifications', element: <Notify /> },
      { path: '*', element: <Navigate to="/404" replace /> }
    ]
  },
  {
    path: '/',
    element: <LogoOnlyLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/login" /> }
    ]
  },
  { path: '*', element: <Navigate to="/login" replace /> }
];
////
function Admin() {
  FormApi.checkAdmin()
    .then((res) => {
      console.log('dang dang nhap duoi quyen admin');
    })
    .catch((err) => {
      console.log('het phien dang nhap');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    });
}
function AutoRefreshToken() {
  console.log('goi ham refresh token');
  if (localStorage.getItem('refreshToken')) {
    FormApi.token({ refreshToken: localStorage.getItem('refreshToken') })
      .then((res) => {
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
      .catch((err) => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      });
  }
}
export default function Router() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!(localStorage.getItem('token') && localStorage.getItem('refreshToken'))) navigate('/login');
  }, []);
  const ref = useRef();
  let isAdmin = localStorage.getItem('token') && localStorage.getItem('refreshToken') ? true : false;
  useEffect(() => {
    const interval = setInterval(AutoRefreshToken, 15 * 60000)
    ref.current = interval
    return () => clearInterval(interval)
  }, []);
  Admin();
  let routes = isAdmin ? routeAdmin : routeNotAdmin;
  return useRoutes(routes);
}
