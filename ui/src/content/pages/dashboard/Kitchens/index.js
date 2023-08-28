import { lazy } from 'react';
import { Grid, Container } from '@mui/material';

const Page = lazy(() => import('src/components/Page'));
const PageTitleWrapper = lazy(() => import('src/components/PageTitleWrapper'));
const PageHeader = lazy(() => import('./PageHeader'));
const RecentKitchens = lazy(() => import('./RecentKitchens'));

function Kitchens() {
  return (
    <Page title="Kitchens" isFooter>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <RecentKitchens />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default Kitchens;
