import { Typography, Grid } from "@mui/material";

// import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

function PageHeader() {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h4" gutterBottom>
          Companies
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
