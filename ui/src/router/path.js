// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_STATUS = '/dashboard/status';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login')
};

export const PATH_STATUS = {
  root: ROOTS_STATUS,
  comingSoon: path(ROOTS_STATUS, '/coming-soon'),
  maintenance: path(ROOTS_STATUS, '/maintenance'),
  page404: path(ROOTS_STATUS, '/404'),
  page500: path(ROOTS_STATUS, '/500')
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  managament: {
    withdrawals: path(ROOTS_DASHBOARD, '/withdrawals'),
    referrals: path(ROOTS_DASHBOARD, '/referrals'),
    referrals: path(ROOTS_DASHBOARD, '/nfts')
  }
};
