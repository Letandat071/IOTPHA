import Title from "../../components/ui/Title";
import { useSelector, useDispatch } from "react-redux";
import {
  quantityDecrease,
  quantityIncrease,
  reset,
} from "../../redux/cartSlice";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Cart = ({ userList }) => {
  const { data: session } = useSession();
  const cart = useSelector((state) => state.cart);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = userList?.find((user) => user._id === session?.user?.id);
  const [productState, setProductState] = useState([]);

  const newOrder = {
    customer: user?.fullName,
    tablename: user?.tableName ? user.tableName : "Error Table",
    id_customer: user?._id,
    total: cart.total,
    products: productState,
    method: 0,
   paymentstatus:'Chưa thanh toán',
  };

  useEffect(() => {
    const productTitles = cart.products.map((product) => ({
      _id: product._id,
      title: product.title,
      price: product.prices,
      foodQuantity: product.foodQuantity,
      extras: product.extras,
      realthuc: product.soLuong,
    }));
    setProductState(productTitles);
  }, [cart.products]);

  const createOrder = async () => {
    try {
      if (session) {
        if (confirm("Vui lòng xác nhận đặt món ăn")) {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/orders`,
            newOrder
          );
          if (res.status === 201) {
            router.push(`/payments`);
            // /order/${res.data._id}
            dispatch(reset());
            toast.success("Đặt hàng thành công");
          } else if (res.status === 400) {
            toast.error(res.data.message);
          }
        }
      } else {
        router.push("/auth/login");
        throw new Error("Bạn cần đăng nhập để đặt hàng");
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const quantityChange = (type, product) => {
    if (type === 0) {
      dispatch(quantityDecrease(product));
    } else if (type === 1) {
      const productInState = productState.find((p) => p._id === product._id);
      if (product.foodQuantity < productInState.realthuc) {
        dispatch(quantityIncrease(product));
      } else {
        toast.error("Vượt quá số lượng hiện có");
      }
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 3 }) + ' VNĐ';
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-between bg-gray-100 text-gray-900">
      <div className="flex-1 p-4 lg:p-10 overflow-auto">
        {cart.products.length > 0 ? (
          <div className="max-h-[40rem] overflow-auto rounded-lg shadow-md bg-white border border-gray-200">
            <table className="w-full text-sm text-center text-gray-500">
              <thead className="text-xs bg-gray-200 uppercase">
                <tr>
                  <th className="py-3 px-2">Món</th>
                  <th className="py-3 px-6">Extras</th>
                  <th className="py-3 px-2">Giá</th>
                  <th className="py-3 px-6">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {cart.products.map((product) => (
                  <tr
                    className="transition-all bg-white hover:bg-gray-50"
                    key={product._id}
                  >
                    <td className="py-4 px-2 font-medium">
                      <span className="text-purple-600">{product.title}</span>
                    </td>
                    <td className="py-5 px-2 font-medium">
                      {product.extras.length > 0
                        ? product.extras.map((item) => (
                            <span key={item._id}>
                              {item.text}
                              <br />
                            </span>
                          ))
                        : "No Extras"}
                    </td>
                    <td className="py-2 px-4 font-medium">{formatPrice(product.prices[0])}</td>
                    <td className="py-4 px-2 font-medium flex justify-center items-center">
                      <button onClick={() => quantityChange(0, product)}>
                        <i className="fa-solid fa-chevron-left mr-3 text-primary cursor-pointer"></i>
                      </button>
                      {product.foodQuantity}
                      <button onClick={() => quantityChange(1, product)}>
                        <i className="fa-solid fa-chevron-right ml-3 text-primary cursor-pointer"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full rounded-lg shadow-md border border-gray-200 p-4 bg-white">
            <h1 className="text-2xl font-semibold">Giỏ hàng trống</h1>
            <button
              className="btn-primary mt-4"
              onClick={() => router.push("/menu")}
            >
              Trang chủ
            </button>
          </div>
        )}
      </div>
      <div className="bg-gray-100 flex flex-col justify-center text-gray-900 p-6 lg:p-20 lg:w-1/4 w-full text-center lg:text-start rounded-lg shadow-md border border-gray-200">
        <Title addClass="text-[20px] lg:text-[40px]">Giỏ hàng</Title>
        <div className="mt-4 lg:mt-6">
          <b>Tổng : </b>{formatPrice(cart.total)}<br /> 
          <b className="inline-block my-1">Giảm giá: </b> 0 VNĐ<br />
          <b>Tổng tiền: </b>{formatPrice(cart.total)}
        </div>
        <button
          className="btn-primary mt-4 md:w-auto w-52"
          onClick={createOrder}
        >
          GỌI MÓN NGAY!
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    return {
      props: {
        userList: res.data ? res.data : [],
      },
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      props: {
        userList: [],
      },
    };
  }
};

export default Cart;
