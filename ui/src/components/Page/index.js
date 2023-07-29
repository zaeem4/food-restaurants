import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { forwardRef, lazy } from 'react';
// @mui
import { Box } from '@mui/material';

const Footer = lazy(() => import('src/components/Footer'));

// ----------------------------------------------------------------------

const Page = forwardRef(({ children, title = '', isFooter, meta, ...other }, ref) => (
  <>
    <Helmet>
      <title>{`${title} | Food App`}</title>
      {meta}
    </Helmet>

    <Box ref={ref} {...other}>
      {children}
    </Box>

    {isFooter && <Footer />}
  </>
));

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node
};

export default Page;
