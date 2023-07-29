import { lazy, useState } from "react";
import { Grid, Container, Stack, Button } from "@mui/material";

const Page = lazy(() => import("src/components/Page"));
const PageTitleWrapper = lazy(() => import("src/components/PageTitleWrapper"));
const PageHeader = lazy(() => import("./PageHeader"));
const RecentMeals = lazy(() => import("./RecentMeals"));
const RecentsIngredients = lazy(() => import("./RecentsIngredients"));

function MealsAndIngredients() {
  const [option, setOption] = useState(1);

  return (
    <Page title="Meals And Ingredients" isFooter>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Stack direction="row" spacing={3}>
              <Button
                variant={option === 1 ? "contained" : "outlined"}
                fullWidth
                onClick={() => setOption(1)}
              >
                Meals
              </Button>
              <Button
                variant={option === 2 ? "contained" : "outlined"}
                fullWidth
                onClick={() => setOption(2)}
              >
                Ingredients
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            {option === 1 ? <RecentMeals /> : <RecentsIngredients />}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default MealsAndIngredients;
