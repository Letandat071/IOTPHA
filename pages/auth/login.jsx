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
  const options = {
    filters: [{ services: ['00001234-0000-1000-8000-00805f9b34fb'] }],
    optionalServices: ['device_information']
  };
  

  const startBleScan = async () => {
    if (!navigator.bluetooth) {
      toast.error("Thiết bị hoặc trình duyệt của bạn không hỗ trợ Bluetooth.");
      return;
    }
  
    try {
      setIsScanning(true);
      toast.info("Đang quét các thiết bị BLE...");
  
      const options = {
        filters: [{ services: ['battery_service'] }],
        optionalServices: ['device_information']
      };
  
      const device = await navigator.bluetooth.requestDevice(options);
  
      device.addEventListener('gattserverdisconnected', onDisconnected);
      const server = await device.gatt.connect();
      console.log('Connected to GATT server');
  
      // Thêm mã xử lý ở đây sau khi kết nối thành công
      const service = await server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');
      const value = await characteristic.readValue();
      const batteryLevel = value.getUint8(0);
      console.log(`Battery level: ${batteryLevel}%`);
  
      // Dừng quét và cập nhật trạng thái
      setIsScanning(false);
      toast.success("Quét BLE thành công và kết nối với thiết bị.");
  
    } catch (error) {
      console.error('Quét Bluetooth thất bại: ', error);
      toast.error("Quét Bluetooth thất bại. Vui lòng thử lại.");
    } finally {
      setIsScanning(false);
    }
  };
  
  const onDisconnected = (event) => {
    const device = event.target;
    console.log(`Device ${device.name} is disconnected.`);
    // Thêm mã xử lý ngắt kết nối ở đây nếu cần
  };
  
  
  
  // Hàm phụ trợ để phân tích dữ liệu beacon
  const parseUUID = (data) => {
    return Array.from(data.slice(4, 20))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
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
      placeholder: formik.values.tableName ? "" : "Vui lòng quét NFC trên bàn",
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
            {isScanning ? "Đang quét..." : "Quét iBeacon"}
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
