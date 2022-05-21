import PropTypes from 'prop-types';
import {useState} from 'react';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import searchFill from '@iconify/icons-eva/search-fill';
// material
import { styled } from '@mui/material/styles';
import { Box, TextField, Autocomplete, InputAdornment } from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  '& .MuiAutocomplete-root': {
    width: 380,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': {
      width: 380,
      '& .MuiAutocomplete-inputRoot': {
        boxShadow: theme.customShadows.z12
      }
    }
  },
  '& .MuiAutocomplete-inputRoot': {
    '& fieldset': {
      borderWidth: `1px !important`,
      borderColor: `${theme.palette.grey[500_32]} !important`
    }
  },
  '& .MuiAutocomplete-option': {
    '&:not(:last-child)': {
      borderBottom: `solid 1px ${theme.palette.divider}`
    }
  }
}));

// ----------------------------------------------------------------------

SchedulesSearch.propTypes = {
  orders: PropTypes.array.isRequired
};

export default function SchedulesSearch({ orders, searchFilter }) {
  return (
    <RootStyle>
      <Autocomplete
        size="medium"
        disablePortal
        popupIcon={null}
        options={orders}
        groupBy={(option) => format(new Date(option.createdAt), 'dd/MM/yyyy')}
        getOptionLabel={(order) => `${order.contactInfo.email}${order._id}`}
        onInputChange={(event, value) => {
          if (value === '') {
            searchFilter('reset');
          }
        }}
        onChange={(event, value) => {
          if (value) {
            searchFilter([value]);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Tìm kiếm lịch hẹn..."
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <Box
                      component={Icon}
                      icon={searchFill}
                      sx={{
                        ml: 1,
                        width: 20,
                        height: 20,
                        color: 'text.disabled'
                      }}
                    />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              )
            }}
          />
        )}
      />
    </RootStyle>
  );
}
