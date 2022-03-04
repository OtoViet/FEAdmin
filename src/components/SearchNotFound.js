import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Không tìm thấy nhân viên
      </Typography>
      <Typography variant="body2" align="center">
        Cho kết quả tìm kiếm &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Kiểm tra lại tên nhân viên.
      </Typography>
    </Paper>
  );
}
