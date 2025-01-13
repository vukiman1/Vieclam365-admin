import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, InputAdornment, Input } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

const GENDER_OPTION = [
  { label: 'Men', value: 'Men' },
  { label: 'Women', value: 'Women' },
  { label: 'Kids', value: 'Kids' },
];

const CATEGORY_OPTION = [
  { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather'] },
  { group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats'] },
  { group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'] },
];

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots',
];

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

const INITIAL_VALUES = {
  companyName: '',
  jobTitle: '',
  contactEmail: '',
  contactPhone: '',
  salaryRange: '',
  applicationDeadline: '',
  careerLevel: '',
  workType: '',
  jobDescription: '',
  jobRequirements: '',
  jobBenefits: '',
  contactPerson: '',
  contactAddress: '',
  recruitmentArea: '',
  genderRequirement: '',
  hiringCount: '',
  images: [],
};

const ProductSchema = Yup.object().shape({
  companyName: Yup.string().required('Tên công ty là bắt buộc'),
  jobTitle: Yup.string().required('Tiêu đề công việc là bắt buộc'),
  contactEmail: Yup.string().email('Email không hợp lệ').required('Email liên hệ là bắt buộc'),
  contactPhone: Yup.string().required('Số điện thoại là bắt buộc'),
  salaryRange: Yup.string().required('Mức lương là bắt buộc'),
  applicationDeadline: Yup.string().required('Hạn nộp hồ sơ là bắt buộc'),
  careerLevel: Yup.string().required('Cấp bậc là bắt buộc'),
  workType: Yup.string().required('Hình thức làm việc là bắt buộc'),
  jobDescription: Yup.string().required('Mô tả công việc là bắt buộc'),
  jobRequirements: Yup.string().required('Yêu cầu công việc là bắt buộc'),
  jobBenefits: Yup.string().required('Quyền lợi là bắt buộc'),
  contactPerson: Yup.string().required('Người liên hệ là bắt buộc'),
  contactAddress: Yup.string().required('Địa chỉ là bắt buộc'),
  recruitmentArea: Yup.string().required('Khu vực tuyển là bắt buộc'),
  genderRequirement: Yup.string().required('Yêu cầu giới tính là bắt buộc'),
  hiringCount: Yup.number().required('Số lượng tuyển là bắt buộc'),
  images: Yup.array().min(1, 'Images is required'),
});

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      ...INITIAL_VALUES,
      ...currentProduct,
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(ProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Handle form submission for job posting
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(isEdit ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
      navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Có lỗi xảy ra', { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      control.setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [control, values.images]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered = values.images && values.images?.filter((file) => file !== inputFile);
    control.setValue('images', filtered);
  };

  const handleRemoveAllFiles = () => {
    control.setValue('images', []);
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="companyName" label="Tên Công Ty" />
              <RHFTextField name="jobTitle" label="Tiêu Đề Công Việc" />
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField 
                  name="salaryRange" 
                  label="Mức Lương" 
                  InputProps={{
                    startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                  }}
                />
                <RHFTextField name="applicationDeadline" label="Hạn Nộp Hồ Sơ" />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFSelect name="careerLevel" label="Cấp Bậc">
                  <option value="Mới tốt nghiệp">Mới tốt nghiệp</option>
                  <option value="Nhân viên">Nhân viên</option>
                  <option value="Quản lý">Quản lý</option>
                </RHFSelect>
                <RHFSelect name="workType" label="Hình Thức Làm Việc">
                  <option value="Toàn thời gian">Toàn thời gian</option>
                  <option value="Bán thời gian">Bán thời gian</option>
                  <option value="Thời vụ - Nghề tự do">Thời vụ - Nghề tự do</option>
                </RHFSelect>
              </Stack>

              <RHFTextField name="jobDescription" label="Mô Tả Công Việc" multiline rows={3} />
              <RHFTextField name="jobRequirements" label="Yêu Cầu Công Việc" multiline rows={3} />
              <RHFTextField name="jobBenefits" label="Quyền Lợi" multiline rows={3} />

              <Typography variant="h6">Thông Tin Liên Hệ</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField name="contactPerson" label="Người Liên Hệ" />
                <RHFTextField name="contactEmail" label="Email Liên Hệ" />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField name="contactPhone" label="Số Điện Thoại" />
                <RHFTextField name="contactAddress" label="Địa Chỉ" />
              </Stack>

              <LoadingButton
                fullWidth
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {isEdit ? 'Cập Nhật Công Việc' : 'Đăng Tin Tuyển Dụng'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <RHFUpload
                name="images"
                maxFiles={3}
                multiple
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
                    Tải lên logo công ty hoặc hình ảnh liên quan
                  </Typography>
                }
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
              />
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFSelect name="recruitmentArea" label="Khu Vực Tuyển">
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </RHFSelect>

                <RHFSelect name="genderRequirement" label="Yêu Cầu Giới Tính">
                  <option value="Không yêu cầu">Không yêu cầu</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </RHFSelect>

                <RHFTextField 
                  name="hiringCount" 
                  label="Số Lượng Tuyển" 
                  type="number"
                  InputProps={{
                    inputProps: { min: 1 }
                  }}
                />
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
