import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import FormApi from './api/formApi';
// ----------------------------------------------------------------------

const routeNotAdmin = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
    children: [
      { path: '', element: <DashboardApp /> },
      { path: 'user', element: <User /> },
      { path: 'products', element: <Products /> },
      { path: 'blog', element: <Blog /> },
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
      { path: 'blog', element: <Blog /> },
      { path: '*', element: <Navigate to="/login" replace /> }
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
  let admin = false;
  FormApi.checkAdmin()
    .then((res) => {
      admin = true;
    })
    .catch((err) => {
      FormApi.token({ refreshToken: localStorage.getItem('refreshToken') })
        .then((res) => {
          localStorage.setItem('token', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          FormApi.checkAdmin()
            .then((res) => {
              admin = true;
            })
            .catch((err) => {
              admin = false;
            });
        })
        .catch((err) => {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        });
    });
}
export default function Router() {
  Admin();
  let isAdmin = localStorage.getItem('token') && localStorage.getItem('refreshToken') ? true : false;
  let routes = isAdmin ? routeAdmin : routeNotAdmin;
  return useRoutes(routes);
}
