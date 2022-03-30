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
        Không tìm thấy hoặc danh sách rỗng
      </Typography>
      <Typography variant="body2" align="center">
        Cho kết quả tìm kiếm &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Kiểm tra lại thông tin.
      </Typography>
    </Paper>
  );
}
