import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { 
  Box, 
  Card, 
  Grid, 
  Stack, 
  Switch, 
  Typography, 
  FormControlLabel,
  Divider
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit = false, currentUser }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    avatarUrl: Yup.string().nullable(),
    isActive: Yup.boolean(),
    isVerifyEmail: Yup.boolean(),
    roleName: Yup.string().required('Role is required'),
    // JobSeeker fields
    ...(currentUser?.roleName === 'JOB_SEEKER' && {
      'jobSeekerProfile.phone': Yup.string().required('Phone number is required'),
      'jobSeekerProfile.birthday': Yup.string().required('Birthday is required'),
      'jobSeekerProfile.gender': Yup.string().required('Gender is required'),
      'jobSeekerProfile.maritalStatus': Yup.string().required('Marital status is required'),
    }),
    // Employer fields
    ...(currentUser?.roleName === 'EMPLOYER' && currentUser?.company && {
      'company.companyName': Yup.string().required('Company name is required'),
      'company.companyEmail': Yup.string().required('Company email is required').email('Email must be a valid email address'),
      'company.companyPhone': Yup.string().required('Company phone is required'),
      'company.websiteUrl': Yup.string(),
      'company.fieldOperation': Yup.string().required('Field of operation is required'),
      'company.employeeSize': Yup.number().required('Employee size is required'),
      'company.location.address': Yup.string().required('Address is required'),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      fullName: currentUser?.fullName || '',
      email: currentUser?.email || '',
      avatarUrl: currentUser?.avatarUrl || null,
      isActive: currentUser?.isActive ?? true,
      isVerifyEmail: currentUser?.isVerifyEmail ?? false,
      roleName: currentUser?.roleName || '',
      // JobSeeker Profile
      jobSeekerProfile: {
        phone: currentUser?.jobSeekerProfile?.phone || '',
        birthday: currentUser?.jobSeekerProfile?.birthday || '',
        gender: currentUser?.jobSeekerProfile?.gender || '',
        maritalStatus: currentUser?.jobSeekerProfile?.maritalStatus || '',
      },
      // Company Info
      company: currentUser?.company ? {
        companyName: currentUser.company.companyName || '',
        companyEmail: currentUser.company.companyEmail || '',
        companyPhone: currentUser.company.companyPhone || '',
        websiteUrl: currentUser.company.websiteUrl || '',
        fieldOperation: currentUser.company.fieldOperation || '',
        employeeSize: currentUser.company.employeeSize || '',
        location: {
          address: currentUser.company.location?.address || '',
        },
      } : null,
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentUser, reset, defaultValues]);

  const onSubmit = async (data) => {
    try {
      // TODO: Implement your update logic here
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.user.list);
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error occurred!', { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
          { shouldValidate: true }
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Label
              color={values.isActive ? 'success' : 'error'}
              sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
            >
              {values.isActive ? 'Active' : 'Inactive'}
            </Label>

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            <FormControlLabel
              labelPlacement="start"
              control={
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  )}
                />
              }
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Account Status
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Enable/Disable account
                  </Typography>
                </>
              }
              sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
            />

            <RHFSwitch
              name="isVerifyEmail"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Email verification status
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="fullName" label="Full Name" />
              <RHFTextField name="email" label="Email Address" />
              
              <RHFSelect native name="roleName" label="Role" disabled={isEdit}>
                <option value="" />
                <option value="JOB_SEEKER">Job Seeker</option>
                <option value="EMPLOYER">Employer</option>
              </RHFSelect>
            </Box>

            {values.roleName === 'JOB_SEEKER' && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Job Seeker Profile
                </Typography>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFTextField name="jobSeekerProfile.phone" label="Phone Number" />
                  <RHFTextField
                    name="jobSeekerProfile.birthday"
                    label="Birthday"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                  <RHFSelect native name="jobSeekerProfile.gender" label="Gender">
                    <option value="" />
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </RHFSelect>
                  <RHFSelect native name="jobSeekerProfile.maritalStatus" label="Marital Status">
                    <option value="" />
                    <option value="S">Single</option>
                    <option value="M">Married</option>
                  </RHFSelect>
                </Box>
              </>
            )}

            {values.roleName === 'EMPLOYER' && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Company Information
                </Typography>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFTextField name="company.companyName" label="Company Name" />
                  <RHFTextField name="company.companyEmail" label="Company Email" />
                  <RHFTextField name="company.companyPhone" label="Company Phone" />
                  <RHFTextField name="company.websiteUrl" label="Website URL" />
                  <RHFTextField name="company.fieldOperation" label="Field of Operation" />
                  <RHFTextField
                    name="company.employeeSize"
                    label="Employee Size"
                    type="number"
                  />
                  <RHFTextField
                    name="company.location.address"
                    label="Address"
                    fullWidth
                    sx={{ gridColumn: '1 / -1' }}
                  />
                </Box>
              </>
            )}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
