import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import FormDialog from '../components/FormCreateUser.js';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//
import useGetAllEmployee from '../hooks/useGetAllEmployee';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fullName', label: 'Họ tên', alignRight: false },
  { id: 'dateOfBirth', label: 'Ngày sinh', alignRight: false },
  { id: 'address', label: 'Địa chỉ', alignRight: false },
  { id: 'phoneNumber', label: 'Liên lạc', alignRight: false },
  { id: 'isVerified', label: 'isVerified', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  let [loading, employees] = useGetAllEmployee();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('fullName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [employeeList, setEmployeeList] = useState(null);
  const [emptyRows, setEmptyRows] = useState(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0);
  const [filteredUsers, setFilteredUsers] = useState(applySortFilter(employees, getComparator(order, orderBy), filterName));
  useEffect(() => {
    setFilteredUsers(applySortFilter(employees, getComparator(order, orderBy), filterName));
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0);
    return setEmployeeList(employees);
  }, [employees]);
  const getEmployeeFromChild = (employee) => {
    employees.push(employee);
    setFilteredUsers(applySortFilter(employees, getComparator(order, orderBy), filterName))
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0);
    setEmployeeList(applySortFilter(employees, getComparator(order, orderBy), filterName));
  };
  const getEmployeeFromChildDelete = (employee) => {
    employees = employees.filter(item => item._id !== employee._id);
    setFilteredUsers(applySortFilter(employees, getComparator(order, orderBy), filterName));
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0);
    setEmployeeList(applySortFilter(employees, getComparator(order, orderBy), filterName));
  };
  const getEmployeeFromChildUpdate = async (employee) => {
    let newEmployeeList = await employees.map(item => {
      if (item._id === employee._id) {
        return employee;
      }
      return item;
    });
    setFilteredUsers(applySortFilter(newEmployeeList, getComparator(order, orderBy), filterName));
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0);
    setEmployeeList(applySortFilter(newEmployeeList, getComparator(order, orderBy), filterName));
  };
  ////

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    console.log('handle sort',isAsc);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = employeeList.map((n) => n.fullName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  if (loading) return <>
    <h2 style={{ textAlign: "center" }}>Đang tải danh sách nhân viên</h2>
    <Stack alignItems="center" mt={10}>
      <CircularProgress size={80} />
    </Stack>
  </>;
  const filteredUsers1 = applySortFilter(employeeList, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers1.length === 0;
  return (
    <Page title="Nhân viên">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Nhân viên
          </Typography>
          <FormDialog parentCallback={getEmployeeFromChild} />
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={employeeList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers1
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { _id, fullName, isVerified, address, dateOfBirth, phoneNumber, image } = row;
                      const isItemSelected = selected.indexOf(fullName) !== -1;

                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, fullName)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={fullName} src={image} />
                              <Typography variant="subtitle2" noWrap>
                                {fullName}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{dateOfBirth}</TableCell>
                          <TableCell align="left">{address}</TableCell>
                          <TableCell align="left">{phoneNumber}</TableCell>
                          <TableCell align="left">
                            {isVerified ? (
                              <Label
                                variant="ghost"
                                color={'success'}
                              >
                                {sentenceCase('Yes')}
                              </Label>) : (<Label
                                variant="ghost"
                                color={'error'}
                              >
                                {sentenceCase('No')}
                              </Label>)}
                          </TableCell>

                          <TableCell align="right">
                            <UserMoreMenu idEmployee={_id}
                              employeeList={employeeList}
                              getEmployeeFromChildUpdate={getEmployeeFromChildUpdate}
                              parentCallback1={getEmployeeFromChildDelete} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={employeeList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} tổng ${count}`}
            labelRowsPerPage="Số dòng mỗi trang"
          />
        </Card>
      </Container>
    </Page>
  );
}
