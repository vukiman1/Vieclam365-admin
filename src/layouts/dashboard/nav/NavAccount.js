import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { CustomAvatar } from '../../../components/custom-avatar';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { user } = useAuthContext();

  return (
    <Link component={RouterLink} to={PATH_DASHBOARD.user.account} underline="none" color="inherit">
      <StyledRoot>
        <CustomAvatar src={user?.avatarUrl} alt={user?.fullName} name={user?.fullName} />

        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.fullName}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {user?.roleName}
          </Typography>
        </Box>
      </StyledRoot>
    </Link>
  );
}
