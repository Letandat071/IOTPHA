import * as Yup from "yup";

export const footerSchema = Yup.object({
  location: Yup.string().required("Vui Lòng Nhập Địa Chỉ"),
  phoneNumber: Yup.string()
    .required("Bắt Buộc Nhập Số Điện Thoại")
    .min(10, "Số Điện Thoại Ít Nhất Phải 10 Số"),
  email: Yup.string().required("Vui Lòng Nhập Mô Tả").email("Email Không Đúng"),
  desc: Yup.string().required("Vui Lòng Nhập Mô Tả"),
  day: Yup.string().required("Vui Lòng Nhập Ngày"),
  time: Yup.string().required("Vui Lòng Nhập Thời Gian"),
});
