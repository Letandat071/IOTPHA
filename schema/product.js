import * as Yup from "yup";

export const productSchema = Yup.object({
  image: Yup.mixed().required("Vui Lòng Chọn Ảnh"),
  title: Yup.string().required("Vui Lòng Nhập Tên Món Ăn"),
  desc: Yup.string().required("Vui Lòng Nhập Mô Tả"),
  smallPrice: Yup.number().required("Vui Lòng Nhập Giá"),
  mediumPrice: Yup.number().required("Vui Lòng Nhập Giá"),
  largePrice: Yup.number().required("Vui Lòng Nhập Giá"),
  soLuong: Yup.number()
    .min(0, 'Số lượng không thể âm')
    .required('Vui lòng nhập số lượng'),
});
