import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import FormApi from '../../../api/formApi.js';
import Dialog from '../../Dialog.js';
import FormUpdateDiscount from '../../FormUpdateDiscount.js';
import DialogConfirm from '../../../components/DialogConfirm.js';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

// ----------------------------------------------------------------------

export default function UserMoreMenu(props) {
  const ref = useRef(null);
  const [store, setStore] = useState(null);
  const [id,setId] = useState(null);
  const [titleDialog, setTitleDialog] = useState('');
  const [dialog, setDialog] = useState(false);
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [contentDialog, setContentDialog] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [openUpdateStore, setOpenUpdateStore] = useState(false);
  useEffect(() => {
    if (store) {
      props.parentCallback1(store);
    }
  }, [store]);
  const dataFromChild = (data) => {
    console.log(data);
    props.getStoreFromChildUpdate(data);
  };
  let statusOpen = (status) => {
    setOpenUpdateStore(status);
  };
  let handleUpdateDiscount = (id) => {
    setOpenUpdateStore(true);
  };
  const handleAfterUpdateDiscount = (status) => {
    props.dialogUpdateDiscount(status);
  };
  const handleClose = (status) => {
    setDialogConfirm(false);
  };
  const handleAccept = (value) => {
    if (value) {
      setTitleDialog('Thông báo');
      props.statusDialogDelete(true);
      FormApi.deleteDiscount(id).then((res) => {
        setDialog(true);
        setContentDialog('Xóa mã giảm giá thành công');
        setStore(res);
      }).catch((err) => {
        setDialog(true);
        setContentDialog('Xóa mã giảm giá thất bại');
        console.log(err);
      });
    }
  }
  return (
    <>
      {
        dialogConfirm ?
          <DialogConfirm title="Thông báo" content="Bạn có chắc muốn xóa mã giảm giá này?"
            open={dialogConfirm}
            cancel="Hủy bỏ" accept="Xác nhận" isAccept={handleAccept} handleCloseDialog={handleClose}
          /> : null
      }
      {dialog ? <Dialog open={dialog} title={titleDialog}
        content={contentDialog} /> : null}
      {openUpdateStore ? <FormUpdateDiscount open={openUpdateStore} parentCallback={statusOpen}
        updateDiscount={handleAfterUpdateDiscount}
        dataFromChild={dataFromChild}
        id={props.idDiscount} discounts={props.discountList} /> : null}

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
          // onClick={() => { handleDeleteDiscount(props.idDiscount) }}>
          onClick={() => {
            setDialogConfirm(true)
            setId(props.idDiscount)
            }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}
          onClick={() => { handleUpdateDiscount() }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
