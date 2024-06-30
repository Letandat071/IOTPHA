import * as Yup from "yup";

export const loginSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required."),
  tableName: Yup.string().required("Table Name is required."),
});
