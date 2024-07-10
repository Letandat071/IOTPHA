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


  const checkBluetoothPermission = async () => {
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'bluetooth' });
        if (result.state === 'granted') {
          return true;
        } else if (result.state === 'prompt') {
          toast.info("Vui lòng cấp quyền Bluetooth khi được yêu cầu.");
          return true;
        } else {
          toast.error("Quyền Bluetooth bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.");
          return false;
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra quyền Bluetooth:', error);
        return false;
      }
    }
    return true; // Nếu API permissions không được hỗ trợ, giả định là có quyền
  };

  const checkLocationPermission = async () => {
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        if (result.state === 'granted') {
          return true;
        } else if (result.state === 'prompt') {
          toast.info("Vui lòng cấp quyền truy cập vị trí khi được yêu cầu.");
          return true;
        } else {
          toast.error("Quyền truy cập vị trí bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.");
          return false;
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra quyền vị trí:', error);
        return false;
      }
    }
    return true; // Nếu API permissions không được hỗ trợ, giả định là có quyền
  };

  const startBleScan = async () => {
    if (!navigator.bluetooth) {
      toast.error("Thiết bị hoặc trình duyệt của bạn không hỗ trợ Bluetooth.");
      return;
    }

    const hasBluetoothPermission = await checkBluetoothPermission();
    const hasLocationPermission = await checkLocationPermission();

    if (!hasBluetoothPermission || !hasLocationPermission) {
      return;
    }

    try {
      setIsScanning(true);
      toast.info("Đang quét iBeacon...");

      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['fe9a'] }  // iBeacon service UUID
        ],
        optionalServices: ['battery_service']  // Thêm bất kỳ dịch vụ nào bạn muốn truy cập
      });

      console.log('Thiết bị được tìm thấy:', device.name);

      device.addEventListener('advertisementreceived', (event) => {
        console.log('Nhận được quảng cáo:', event);

        const manufacturerData = event.manufacturerData;
        for (const [key, value] of manufacturerData) {
          if (key === 0x004C) { // Apple's company identifier
            const data = new Uint8Array(value.buffer);
            if (data[0] === 0x02 && data[1] === 0x15) { // iBeacon identifier
              const uuid = parseUUID(data.slice(2, 18));
              const major = (data[18] << 8) | data[19];
              const minor = (data[20] << 8) | data[21];

              console.log('iBeacon found:', { uuid, major, minor });

              if (uuid === '2f234454-cf6d-4a0f-adf2-f4911ba9ffa6' && major === 1 && minor === 1) {
                formik.setFieldValue('tableName', '1');
                toast.success("Số bàn đã được đặt thành 1 dựa trên dữ liệu iBeacon.");
                device.unwatchAdvertisements();
                setIsScanning(false);
              }
            }
          }
        }
      });

      await device.watchAdvertisements();

      // Dừng quét sau 10 giây
      setTimeout(() => {
        if (isScanning) {
          device.unwatchAdvertisements();
          setIsScanning(false);
          toast.warn("Không tìm thấy iBeacon phù hợp. Vui lòng thử lại.");
        }
      }, 10000);

    } catch (error) {
      console.error('Quét Bluetooth thất bại: ', error);
      toast.error("Quét Bluetooth thất bại. Vui lòng thử lại.");
      setIsScanning(false);
    }
  };

  const parseUUID = (data) => {
    return Array.from(data)
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
