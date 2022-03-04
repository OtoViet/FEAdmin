// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppConversionRates
} from '../components/_dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Thống kê">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Thống kê</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={12}>
            <AppWebsiteVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <AppConversionRates />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppOrderTimeline />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <AppTasks />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
