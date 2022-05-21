import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Link, Card, Grid, Typography, CardContent } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)'
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

SchedulesCard.propTypes = {
  order: PropTypes.object.isRequired,
  index: PropTypes.number
};

export default function SchedulesCard({ order, index }) {
  const { createdAt, contactInfo } = order;

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ position: 'relative' }}>
        <CardMediaStyle>
          <CoverImgStyle alt={"anh don hang"} src={"/static/icons/schedule.svg"} />
        </CardMediaStyle>

        <CardContent
          sx={{
            pt: 4
          }}
        >
          <Typography
            gutterBottom
            variant="caption"
            sx={{ color: 'text.disabled', display: 'block' }}
          >
            {fDate(createdAt)}
          </Typography>

          <TitleStyle
            to={"/orders/order/"+order._id}
            color="inherit"
            variant="subtitle2"
            underline="hover"
            component={RouterLink}
          >
            {"Lịch hẹn từ khách hàng "+contactInfo.name}
          </TitleStyle>
        </CardContent>
      </Card>
    </Grid>
  );
}
