// pages/admin/profile.jsx
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useRef } from "react";
import Category from "../../components/admin/Category";
import Footer from "../../components/admin/Footer";
import Order from "../../components/admin/Order";
import Products from "../../components/admin/Products";
import Tables from "../../components/admin/Tables";
import CategoryVisibilityUpdater from "../../components/admin/CategoryVisibilityUpdater"; // Import the new component
import { toast } from "react-toastify";

const Profile = () => {
  const [tabs, setTabs] = useState(0);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const { push } = useRouter();
  const [foodCount, setFoodCount] = useState(0);
  const [newpaysCount, setNewpaysCount] = useState(0);
  const prevFoodCountRef = useRef(0);
  const prevPayCountRef = useRef(0);

  const closeAdminAccount = async () => {
    try {
      if (confirm("Bạn có muốn đăng xuất khỏi tài khoản Admin")) {
        const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin`);
        if (res.status === 200) {
          push("/admin");
          toast.success("Admin Account Closed!");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
      const orders = res.data;
      const newOrders = orders.filter(order => order.paymentstatus === "Chưa thanh toán");
      setNewOrdersCount(newOrders.length);
      if (newOrders.length > newOrdersCount) {
        const audio = new Audio("/sounds/order.mp3");
        audio.play();
      }
    } catch (error) {
      console.log(error);
    }
  }, [newOrdersCount]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const fetchPays = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
      const orders = res.data;
      const newPays = orders.filter(order => order.paymentstatus === "Đang chờ xác nhận");
      setNewpaysCount(newPays.length);
      if (newPays.length > setNewpaysCount) {
        const audio = new Audio("/sounds/payment.mp3");
        audio.play();
      }
    } catch (error) {
      console.log(error);
    }
  }, [setNewpaysCount]);

  useEffect(() => {
    fetchPays();
    const interval = setInterval(fetchPays, 10000);
    return () => clearInterval(interval);
  }, [fetchPays]);

  useEffect(() => {
    if (newpaysCount > prevPayCountRef.current) {
      const audio = new Audio("/sounds/payment.mp3");
      audio.play();
    }
    prevPayCountRef.current = newpaysCount;
  }, [newpaysCount]);

  const fetchFood = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      const products = res.data;
      const foodRunOut = products.filter(product => product.soLuong === 0);
      setFoodCount(foodRunOut.length);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchFood();
    const interval = setInterval(fetchFood, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (foodCount > prevFoodCountRef.current) {
      const audio = new Audio("/sounds/nofood.mp3");
      audio.play();
    }
    prevFoodCountRef.current = foodCount;
  }, [foodCount]);

  return (
    <div className="flex px-10 min-h-[calc(100vh_-_433px)] lg:flex-row flex-col lg:mb-0 mb-10">
      <div className="lg:w-80 w-100 flex-shrink-0 lg:h-[100vh] justify-center flex flex-col border-l-2 border-r-4 shadow-2xl">
        <div className="relative flex flex-col items-center px-10 py-5 border-b-0">
          <Image
            src="/images/admin.png"
            alt=""
            width={100}
            height={100}
            className="rounded-full"
          />
          <b className="text-2xl mt-1">Admin</b>
        </div>
        <ul className="text-center font-semibold">
          <li
            className={`border w-full p-3 cursor-pointer hover:bg-gray-600 hover:text-white transition-all ${tabs === 0 && "bg-gray-600 text-white"}`}
            onClick={() => setTabs(0)}
          >
            <i className="fas fa-utensils"></i>
            <button className="ml-1 relative">Quản Lý Món Ăn
              {foodCount > 0 && (
                <span className="absolute top-0 right-40 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {foodCount}
                </span>
              )}
            </button>
          </li>
          <li
            className={`border w-full p-3 cursor-pointer hover:bg-gray-600 hover:text-white transition-all ${tabs === 1 && "bg-gray-600 text-white"}`}
            onClick={() => setTabs(1)}
          >
            <i className="fa fa-box"></i>
            <button className="ml-1 relative">
              Quản Lý Đơn Hàng
              {newOrdersCount > 0 && (
                <span className="absolute top-0 right-40 mr-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {newOrdersCount}
                </span>
              )}
              {newpaysCount > 0 && (
                <span className="absolute top-0 left-40 ml-0 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {newpaysCount}
                </span>
              )}
            </button>
          </li>
          <li
            className={`border w-full p-3 cursor-pointer hover:bg-gray-600 hover:text-white transition-all ${tabs === 2 && "bg-gray-600 text-white"}`}
            onClick={() => setTabs(2)}
          >
            <i className="fa fa-list"></i>
            <button className="ml-1">Quản Lý Danh Mục</button>
          </li>
          <li
            className={`border w-full p-3 cursor-pointer hover:bg-gray-600 hover:text-white transition-all ${tabs === 3 && "bg-gray-600 text-white"}`}
            onClick={() => setTabs(3)}
          >
            <i className="fa fa-table"></i>
            <button className="ml-1">Quản Lý Bàn</button>
          </li>
          <li
            className={`border w-full p-3 cursor-pointer hover:bg-gray-600 hover:text-white transition-all ${tabs === 4 && "bg-gray-600 text-white"}`}
            onClick={() => setTabs(4)}
          >
            <i className="fa fa-window-maximize"></i>
            <button className="ml-1">Cài Đặt Footer</button>
          </li>
          <li
            className="border w-full p-3 cursor-pointer hover:bg-gray-600 hover:text-white transition-all"
            onClick={() => window.open("/", "_blank")}
          >
            <i className="fa-solid fa-house"></i>
            <button className="ml-1">
              Trang Chủ <br />
            </button>
          </li>
          <li
            className={`border w-full p-3 cursor-pointer hover:bg-gray-600 hover:text-white transition-all ${tabs === 5 && "bg-gray-600 text-white"}`}
            onClick={closeAdminAccount}
          >
            <i className="fa fa-sign-out"></i>
            <button className="ml-1">Exit</button>
          </li>
        </ul>
      </div>
      {tabs === 0 && <Products />}
      {tabs === 1 && <Order />}
      {tabs === 2 && <Category />}
      {tabs === 3 && <Tables />}
      {tabs === 4 && <Footer />}
      <CategoryVisibilityUpdater /> {/* Include the new component */}
    </div>
  );
};

export const getServerSideProps = (ctx) => {
  const myCookie = ctx.req?.cookies || "";
  if (myCookie.token !== process.env.ADMIN_TOKEN) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Profile;
