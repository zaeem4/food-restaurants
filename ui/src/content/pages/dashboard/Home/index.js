import { lazy, useEffect, useState } from "react";
import { Grid, Container, Card, Typography, CardHeader } from "@mui/material";
import { Box } from "@mui/system";
// import { apiCall } from 'src/utils/axios';

const Page = lazy(() => import("src/components/Page"));
const PageTitleWrapper = lazy(() => import('src/components/PageTitleWrapper'));
const PageHeader = lazy(() => import('./PageHeader'));

function Home() {
  const [data, setData] = useState({
    totalRestaurant: 0,
    totalEmployees: 0,
    totalcompanies: 0,
    totalturnover: 0,
  });

  useEffect(() => {
    const fetchData = async () => {};

    fetchData();
    return () => {
      setData({
        totalturnover: 0,
        totalRestaurant: 0,
        totalcompanies: 0,
        totalEmployees: 0,
      });
    };
  }, []);

  return (
    <Page title="Home" isFooter>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        {data && (
          <Grid
            py={3}
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
            sx={{
              "& .MuiPaper-outlined": {
                height: "100%",
              },
            }}
          >
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardHeader title="Total Restaurant" />
                <Box px={2}>
                  <Typography variant="h2" textAlign="center">
                    {data.totalRestaurant}
                  </Typography>
                  <br />
                  <Typography variant="caption" gutterBottom>
                    Last Created: <b> {`${new Date().toDateString()}`} </b>
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardHeader title="Total Companies" />
                <Box px={2}>
                  <Typography variant="h2" textAlign="center">
                    {data.totalcompanies}
                  </Typography>
                  <br />
                  <Typography variant="caption" gutterBottom>
                    Last Created: <b> {`${new Date().toDateString()}`} </b>
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardHeader title="Total Turnover" />
                <Box px={2}>
                  <Typography variant="h2" textAlign="center">
                    {data.totalturnover}
                  </Typography>
                  <br />
                  <Typography variant="caption" gutterBottom>
                    Last Credited: <b> Rs 10000 </b> <br />
                    Date: <b> {`${new Date().toDateString()}`} </b>
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardHeader title="Total Employees" />
                <Box px={2}>
                  <Typography variant="h2" textAlign="center">
                    {data.totalEmployees}
                  </Typography>
                  <br />
                  <Typography variant="caption" gutterBottom>
                    Recent Joining: <b> 10 </b> <br />
                    Date: <b> {`${new Date().toDateString()}`} </b>
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Page>
  );
}

export default Home;
