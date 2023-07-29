import PropTypes from 'prop-types';
// @mui
// import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import LogoPath from 'src/assest/Logo/logo.png';
// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object
};

export default function Logo({ disabledLink = false, sx }) {
  const logo = (
    <Box src={LogoPath} component="img" sx={{ width: 40, height: 40, ...sx }} />
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <a href={process.env.REACT_APP_CLIENT_URL}>{logo}</a>;
}
