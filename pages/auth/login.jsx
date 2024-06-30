import { useFormik } from "formik";
import Link from "next/link";
import Input from "../../components/form/Input";
import Title from "../../components/ui/Title";
import { loginSchema } from "../../schema/login";
import {getSession, signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
const Login = () => {
  const { push } = useRouter();
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState();


  const onSubmit = async (values, actions) => {
    const { fullName, tableName } = values;
    let options = { redirect: false, fullName, tableName };
    try {
      const res = await signIn("credentials", options);
      if (res.error) {
        throw new Error(res.error);
      }
      actions.resetForm();
      toast.success("Login successfully", {
        position: "bottom-left",
        theme: "colored",
      });
      push("/profile/" + user._id);
    } catch (err) {
      if(err.message != "user is not defined"){
        toast.error(err.message);
      }
    }
  };
  

  const onLogout = async () => {
    try {
      await signOut({ redirect: false });
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableName: "1" }), // Thay thế "1" bằng giá trị thực tế
      });
      toast.success("Logout successfully", {
        position: "bottom-left",
        theme: "colored",
      });
      push("/auth/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      tableName: "",
    },
    onSubmit,
    validationSchema: loginSchema,
  });


  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
        setCurrentUser(
          res.data?.find((user) => user._id === session?.user?.id)
        );
        session && push("/");
        // "/profile/" + currentUser?._id
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [session, push, currentUser]);

  const inputs = [
    {
      id: 1,
      name: "fullName",
      type: "text",
      placeholder: "Your Full Name",
      value: formik.values.fullName,
      errorMessage: formik.errors.fullName,
      touched: formik.touched.fullName,
    },
    {
      id: 2,
      name: "tableName",
      type: "text",
      placeholder: "Table Name",
      value: formik.values.tableName,
      errorMessage: formik.errors.tableName,
      touched: formik.touched.tableName,
    },
  ];

  return (
    <div className="container mx-auto">
      <form
        className="flex flex-col items-center my-20 md:w-1/2 w-full mx-auto"
        onSubmit={formik.handleSubmit}
      >
        <Title addClass="text-[40px] mb-6">Login</Title>
        <div className="flex flex-col gap-y-3 w-full">
          {inputs.map((input) => (
            <Input
              key={input.id}
              {...input}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          ))}
        </div>
        <div className="flex flex-col w-full gap-y-3 mt-6">
          <button className="btn-primary" type="submit">
            LOGIN
          </button>
          <button
            className="btn-primary !bg-secondary"
            type="button"
            onClick={onLogout}
          >
            LOGOUT
          </button>
          <Link href="/auth/register">
            <span className="text-sm underline cursor-pointer text-secondary">
              Do you not have an account?
            </span>
          </Link>
        </div>
      </form>
    </div>
  );
};


export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
  const user = res.data?.find((user) => user._id === session?.user.id);
  if (session && user) {
    return {
      redirect: {
        destination: "/profile/" + user._id,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}



export default Login;
