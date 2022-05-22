import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import FormDialog from '../components/FormCreateNewStore.js';
import Dialog from '../components/Dialog.js';
// material
import {
  Card,
  Table,
  Stack,
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
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/storeList';
//
import useGetAllStore from '../hooks/useGetAllStore';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Tên cửa hàng', alignRight: false },
  { id: 'numOfStore', label: 'Thứ tự', alignRight: false },
  { id: 'address', label: 'Địa chỉ', alignRight: false },
  { id: 'phoneNumber', label: 'Liên lạc', alignRight: false },
  { id: 'email', label: 'email', alignRight: false },
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
    return filter(array, (_store) => _store.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function StoreList() {
  let [loading, stores] = useGetAllStore();
  const [dialog, setDialog] = useState(false);
  const [titleDialog, setTitleDialog] = useState('');
  const [contentDialog, setContentDialog] = useState('');
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [storeList, setStoreList] = useState(null);
  const [emptyRows, setEmptyRows] = useState(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - stores.length) : 0);
  const [filteredUsers, setFilteredStore] = useState(applySortFilter(stores, getComparator(order, orderBy), filterName));
  useEffect(() => {
    setFilteredStore(applySortFilter(stores, getComparator(order, orderBy), filterName));
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - stores.length) : 0);
    return setStoreList(stores);
  }, [stores]);
  const getStoreFromChild = (storeChild) => {
    setFilteredStore(applySortFilter([...storeList, storeChild], getComparator(order, orderBy), filterName))
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - [...storeList, storeChild].length) : 0);
    setStoreList(applySortFilter([...storeList, storeChild], getComparator(order, orderBy), filterName));
  };
  const getStoreFromChildDelete = (storeChild) => {
    stores = storeList.filter(item => item._id !== storeChild._id);
    setFilteredStore(applySortFilter(stores, getComparator(order, orderBy), filterName));
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - stores.length) : 0);
    setStoreList(applySortFilter(stores, getComparator(order, orderBy), filterName));
  };
  const getStoreFromChildUpdate = async (storeChild) => {
    let newStoreList = await storeList.map(item => {
      if (item._id === storeChild._id) {
        return storeChild;
      }
      return item;
    });
    setFilteredStore(applySortFilter(newStoreList, getComparator(order, orderBy), filterName));
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - storeList.length) : 0);
    setStoreList(applySortFilter(newStoreList, getComparator(order, orderBy), filterName));
  };
  ////
  const statusDialogDelete = (status) => {
    setDialog(status);
    setTitleDialog('Thông báo');
    setContentDialog('Xóa cửa hàng thành công !');
  };
  const dialogUpdateStore = (status) => {
    setDialog(status);
    setTitleDialog('Thông báo');
    setContentDialog('Cập nhật thông tin cửa hàng thành công !');
  };
  const handleClose = (value)=>{
    setDialog(value);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    console.log('handle sort',isAsc);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = storeList.map((n) => n.name);
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
    <h2 style={{ textAlign: "center" }}>Đang tải danh sách cửa hàng</h2>
    <Stack alignItems="center" mt={10}>
      <CircularProgress size={80} />
    </Stack>
  </>;
  const filteredUsers1 = applySortFilter(storeList, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers1.length === 0;
  return (
    <Page title="Cửa hàng">
      {dialog ? <Dialog open={dialog} onClose={handleClose} title={titleDialog} content={contentDialog} /> : null}
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Cửa hàng
          </Typography>
          <FormDialog parentCallback={getStoreFromChild} />
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
                  rowCount={storeList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers1
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { _id, name, email, numOfStore, address, phoneNumber } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;

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
                              onChange={(event) => handleClick(event, name)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{numOfStore}</TableCell>
                          <TableCell align="left">{address}</TableCell>
                          <TableCell align="left">{phoneNumber}</TableCell>
                          <TableCell align="left">{email}</TableCell>

                          <TableCell align="right">
                            <UserMoreMenu idStore={_id}
                              storeList={storeList}
                              getStoreFromChildUpdate={getStoreFromChildUpdate}
                              dialogUpdateStore={dialogUpdateStore}
                              statusDialogDelete={statusDialogDelete}
                              parentCallback1={getStoreFromChildDelete} />
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
            count={storeList.length}
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
