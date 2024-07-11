import { useFormik } from "formik";
import Input from "../../components/form/Input";
import Title from "../../components/ui/Title";
import { loginSchema } from "../../schema/login";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";

const Login = () => {
  const { push } = useRouter();
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState();
  const [nfcSupported, setNfcSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedTable, setConnectedTable] = useState(null);

  const onSubmit = async (values, actions) => {
    const { fullName, tableName } = values;
    let options = { redirect: false, fullName, tableName };
    try {
      const res = await signIn("credentials", options);
      console.log("Sign in response:", res);

      if (res.error) {
        throw new Error(res.error);
      }

      actions.resetForm();
      toast.success("Login successful", {
        position: "bottom-left",
        theme: "colored",
      });

      if (res.ok) {
        const userResponse = await axios.get('/api/auth/session');
        console.log("User session data:", userResponse.data);

        if (userResponse.data.user && userResponse.data.user.id) {
          push("/profile/" + userResponse.data.user.id);
        } else {
          console.error("User ID not available in session data");
          toast.error("Login successful, but user data is incomplete");
        }
      } else {
        console.error("Login response not OK");
        toast.error("Login process completed, but encountered an issue");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "An error occurred during login");
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
        if (session?.user?.id) {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
          setCurrentUser(res.data?.find((user) => user._id === session.user.id));
          if (session && currentUser) {
            push("/profile/" + currentUser._id);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [session, push, currentUser]);

  useEffect(() => {
    if ('NDEFReader' in window) {
      setNfcSupported(true);
    } else {
      setNfcSupported(false);
      toast.error("NFC is not supported on this device.");
    }
  }, []);

  const startNfcScan = async () => {
    if (!nfcSupported) {
      toast.error("NFC is not supported on this device.");
      return;
    }

    try {
      const nfcReader = new window.NDEFReader();
      await nfcReader.scan();
      toast.success("NFC scanning started. Please scan the NFC tag.");

      nfcReader.onreading = (event) => {
        for (const record of event.message.records) {
          if (record.recordType === "text") {
            const textDecoder = new TextDecoder(record.encoding);
            const nfcData = textDecoder.decode(record.data);
            const tableNameMatch = nfcData.match(/TableName=(\d+)/);

            if (tableNameMatch) {
              formik.setFieldValue('tableName', tableNameMatch[1]);
            }
          }
        }
      };
    } catch (error) {
      console.log('NFC scanning failed: ', error);
      toast.error("NFC scanning failed. Please try again.");
    }
  };

  const startBleScan = async () => {
    if (!navigator.bluetooth) {
      toast.error("Bluetooth is not supported on this device.");
      return;
    }

    setIsScanning(true);

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'generic_access'],
      });

      device.addEventListener('gattserverdisconnected', () => {
        console.log('Device disconnected');
        setIsScanning(false);
      });

      device.addEventListener('advertisementreceived', (event) => {
        const deviceName = event.device.name || 'Unknown Device';
        const tableMatch = deviceName.match(/^Bàn (\d+)$/);
        if (tableMatch) {
          const tableNumber = tableMatch[1];
          if (connectedTable !== tableNumber) {
            formik.setFieldValue('tableName', tableNumber);
            setConnectedTable(tableNumber);
            // toast.success(`Bluetooth device '${deviceName}' found and TableName set to ${tableNumber}`);
            setTimeout(() => setConnectedTable(null), 30000); // reset connectedTable after 30 seconds
          }
          device.gatt.disconnect();
          setIsScanning(false);
        }
      });

      await device.watchAdvertisements();
    } catch (error) {
      console.error('BLE scanning failed: ', error);
      toast.error("BLE scanning failed. Please try again.");
      setIsScanning(false);
    }
  };

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
      placeholder:"Vui lòng quét NFC trên bàn",
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
            onClick={startNfcScan}
          >
            Bật NFC Để Quét
          </button>
          <button
            className="btn-primary !bg-secondary"
            type="button"
            onClick={startBleScan}
            disabled={isScanning}
          >
            {isScanning ? "Đang quét..." : "Quét BLE"}
          </button>
        </div>
      </form>
    </div>
  );
};

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (session?.user?.id) {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    const user = res.data?.find((user) => user._id === session.user.id);
    if (user) {
      return {
        redirect: {
          destination: "/profile/" + user._id,
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
}

export default Login;
