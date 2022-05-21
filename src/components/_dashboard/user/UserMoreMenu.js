import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import FormApi from '../../../api/formApi.js';
import Dialog from '../../../components/Dialog.js';
import FormUpdateUser from '../../../components/FormUpdateInfoUser.js';
import DialogConfirm from '../../../components/DialogConfirm.js';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

// ----------------------------------------------------------------------

export default function UserMoreMenu(props) {
  const ref = useRef(null);
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [id, setId] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [titleDialog, setTitleDialog] = useState('');
  const [dialog, setDialog] = useState(false);
  const [contentDialog, setContentDialog] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [openUpdateEmployee, setOpenUpdateEmployee] = useState(false);
  useEffect(() => {
    if (employee) {
      props.parentCallback1(employee);
    }
  }, [employee]);
  const dataFromChild = (data) => {
    console.log(data);
    props.getEmployeeFromChildUpdate(data);
  };
  let statusOpen = (status) => {
    setOpenUpdateEmployee(status);
  };
  let handleUpdateEmployee = (id) => {
    setOpenUpdateEmployee(true);
  };
  const handleClose = (status) => {
    setDialogConfirm(false);
  };
  const handleAccept = (value) => {
    if (value) {
      setTitleDialog('Thông báo');
      FormApi.deleteEmployee(id).then((res) => {
        setEmployee(res);
        setDialog(true);
        setContentDialog('Xóa tài khoản nhân viên thành công');
      }).catch((err) => {
        setDialog(true);
        setContentDialog('Xóa tài khoản nhân viên thất bại');
        console.log(err);
      });
    }
  }
  return (
    <>
      {
        dialogConfirm ?
          <DialogConfirm title="Thông báo" content="Bạn có chắc muốn xóa nhân viên này?"
            open={dialogConfirm}
            cancel="Hủy bỏ" accept="Xác nhận" isAccept={handleAccept} handleCloseDialog={handleClose}
          /> : null
      }
      {dialog ? <Dialog open={dialog} title={titleDialog} content={contentDialog} /> : null}
      {openUpdateEmployee ? <FormUpdateUser open={openUpdateEmployee} parentCallback={statusOpen}
        dataFromChild={dataFromChild}
        id={props.idEmployee} employees={props.employeeList} /> : null}

      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }}
          onClick={() => {
            setDialogConfirm(true)
            setId(props.idEmployee)
          }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}
          onClick={() => { handleUpdateEmployee() }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
