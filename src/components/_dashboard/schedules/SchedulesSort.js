import { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { MenuItem, TextField } from '@mui/material';

// ----------------------------------------------------------------------

SchedulesSort.propTypes = {
  options: PropTypes.array,
  onSort: PropTypes.func
};

export default function SchedulesSort({ options, onSort }) {
  const [value, setValue] = useState('latest');
  const handleChange = (event) => {
    setValue(event.target.value);
    onSort(event.target.value);
  };
  return (
    <TextField select size="small" value={value} onChange={handleChange}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
