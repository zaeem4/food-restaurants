import { lazy, useEffect, useState } from "react";
import { Grid, Container, Card, Typography, CardHeader } from "@mui/material";
import { Box } from "@mui/system";

import { apiGet } from "src/utils/axios";

const Page = lazy(() => import("src/components/Page"));
const PageTitleWrapper = lazy(() => import("src/components/PageTitleWrapper"));
const PageHeader = lazy(() => import("./PageHeader"));

function Home() {
  const [data, setData] = useState({
    totalRestaurant: 0,
    lastRestaurantCreated: new Date().toLocaleString(),
    totalEmployees: 0,
    totalCompanies: 0,
    lastCompanyCreated: new Date().toLocaleString(),
    totalTurnover: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiGet("/admin/total-counts");

      if (response.success) {
        setData({
          ...data,
          totalRestaurant: response.totalCount.restaurant_count,
          totalCompanies: response.totalCount.company_count,
          totalEmployees: response.totalCount.employee_count,
          lastRestaurantCreated: new Date(
            response.totalCount.last_restaurant_created
          ).toLocaleString(),
          lastCompanyCreated: new Date(
            response.totalCount.last_company_created
          ).toLocaleString(),
        });
      }
    };

    fetchData();

    return () => {
      setData({
        totalTurnover: 0,
        totalRestaurant: 0,
        totalCompanies: 0,
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
                    Last Created: <b> {data.lastRestaurantCreated} </b>
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardHeader title="Total Companies" />
                <Box px={2}>
                  <Typography variant="h2" textAlign="center">
                    {data.totalCompanies}
                  </Typography>
                  <br />
                  <Typography variant="caption" gutterBottom>
                    Last Created: <b> {data.lastCompanyCreated} </b>
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardHeader title="Total Turnover" />
                <Box px={2}>
                  <Typography variant="h2" textAlign="center">
                    {data.totalTurnover}
                  </Typography>
                  <br />
                  <Typography variant="caption" gutterBottom>
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
