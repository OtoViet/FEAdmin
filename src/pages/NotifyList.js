// material
import { Container, Stack, Typography, CircularProgress } from '@mui/material';
// components
import Page from '../components/Page';
import {
    NotifyList
} from '../components/_dashboard/notify';
//
import useGetAllNotification from '../hooks/useGetAllNotification';

// ----------------------------------------------------------------------

export default function Notify() {
  const [loading, notifications] = useGetAllNotification();

  if (loading) return <>
    <h2 style={{ textAlign: "center" }}>Đang tải danh sách thông báo</h2>
    <Stack alignItems="center" mt={10}>
      <CircularProgress size={80} />
    </Stack>
  </>;

  return (
    <Page title="Thông báo">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Thông báo
        </Typography>
        <NotifyList notifications={notifications} />
      </Container>
    </Page>
  );
}
