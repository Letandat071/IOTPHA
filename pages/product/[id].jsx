import Image from "next/image";
import { useState } from "react";
import Title from "../../components/ui/Title";
import { addProduct } from "../../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Index = ({ food }) => {
  // Chuyển đổi giá từ dạng chuỗi có dấu chấm thành số nguyên
  const formatPrices = food.prices.map(price => parseInt((price.toString().replace(/\./g, '')) * 1000));
  const [prices, setPrices] = useState(formatPrices);
  const [price, setPrice] = useState(prices[0]);
  const [size, setSize] = useState(0);
  const cart = useSelector((state) => state.cart);

  const findCart = cart.products.find((item) => item._id === food._id);

  const dispatch = useDispatch();

  const handleSize = (sizeIndex) => {
    const difference = prices[sizeIndex] - prices[size];
    setSize(sizeIndex);
    changePrice(difference);
  };

  const changePrice = (number) => {
    setPrice(price + number);
  };

  const handleClick = () => {
    dispatch(
      addProduct({
        ...food,
        foodQuantity: 1,
        title: food.title,
        img: food.img,
        price,
        quantity: 1,
      })
    );
  };

  return (
    <div className="flex items-center md:h-[calc(100vh_-_88px)] gap-5 py-20 flex-wrap">
      <div className="relative md:flex-1 md:w-[80%] md:h-[80%] w-36 h-36 mx-auto">
        <Image
          src={food?.img}
          alt=""
          layout="fill"
          objectFit="contain"
          priority
        />
      </div>
      <div className="md:flex-1 md:text-start text-center">
        <Title addClass="text-6xl">{food.title}</Title>
        <span className="text-primary text-2xl font-bold underline underline-offset-1 my-4 inline-block">
          {price.toLocaleString()} VND
        </span>
        <p className="text-sm my-4 md:pr-24">{food.desc}</p>
        {food.category === "" && (
          <div>
            <h4 className="text-xl font-bold">Chọn kích cỡ</h4>
            <div className="flex items-center gap-x-20 md:justify-start justify-center min-h-[100px]">
              <div
                className={`relative w-8 h-8 cursor-pointer hover:h-10 hover:w-10 transition-all ${
                  size === 0 && "border-4 border-primary rounded-full w-10 h-10"
                }`}
                onClick={() => handleSize(0)}
              >
                <Image src="/images/size.png" alt="" layout="fill" />
                <span className="absolute top-0 -right-6 text-xs bg-primary rounded-full px-[5px] font-medium">
                  Nhỏ
                </span>
              </div>
              <div
                className={`relative w-12 h-12 cursor-pointer hover:h-14 hover:w-14 transition-all ${
                  size === 1 && "border-4 border-primary rounded-full w-16 h-16"
                }`}
                onClick={() => handleSize(1)}
              >
                <Image src="/images/size.png" alt="" layout="fill" />
                <span className="absolute top-0 -right-6 text-xs bg-primary rounded-full px-[5px] font-medium">
                  Trung bình
                </span>
              </div>
              <div
                className={`relative w-16 h-16 cursor-pointer hover:h-20 hover:w-20 transition-all ${
                  size === 2 && "border-4 border-primary rounded-full w-20 h-20"
                } `}
                onClick={() => handleSize(2)}
              >
                <Image src="/images/size.png" alt="" layout="fill" />
                <span className="absolute top-0 -right-6 text-xs bg-primary rounded-full px-[5px] font-medium">
                  Lớn
                </span>
              </div>
            </div>
          </div>
        )}
        <button
          className="btn-primary"
          onClick={handleClick}
          disabled={findCart}
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`
  );
  return {
    props: {
      food: res.data ? res.data : null,
    },
  };
};

export default Index;
