import Image from "next/image";
import React, { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import Title from "../ui/Title";
import { GiCancel } from "react-icons/gi";
import axios from "axios";
import Input from "../form/Input";
import { useRouter } from "next/router";
import PacmanLoader from "react-spinners/PacmanLoader";

const Search = ({ setIsSearchModal }) => {
  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const router = useRouter();

  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      setProduct(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getProducts();
    }, 1000);
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    const searchFilter = product.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(searchFilter);
  };

  const formatPrice = (price) => {
    return price.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 grid place-content-center">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
      <OutsideClickHandler onOutsideClick={() => setIsSearchModal(false)}>
        <div className="relative z-50 w-full h-full grid place-content-center">
          <div className="relative z-50 md:w-[600px] w-[370px] bg-white border-2 p-10 rounded-3xl shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-all"
              onClick={() => setIsSearchModal(false)}
            >
              <GiCancel size={25} />
            </button>
            <Title addClass="text-[40px] text-center mb-4">Tìm Kiếm</Title>
            <Input
              type="text"
              placeholder={search ? "" : "Vui Lòng Nhập"}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-primary focus:ring-1"
            />
            {product.length > 0 ? (
              <ul className="mt-6 max-h-60 overflow-y-auto">
                {filtered.length > 0 ? (
                  filtered.slice(0, 5).map((item) => (
                    <li
                      className="flex items-center justify-between p-3 bg-white hover:bg-primary hover:text-white transition-all rounded-lg cursor-pointer mb-2"
                      key={item._id}
                      onClick={() => {
                        router.push(`/product/${item?._id}`);
                        setIsSearchModal(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="relative w-12 h-12">
                          <Image
                            src={item?.img}
                            alt={item.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </div>
                        <span className="ml-3 font-medium">{item.title}</span>
                      </div>
                      <span className="font-bold">{formatPrice(item.prices[0])} VNĐ</span>
                    </li>
                  ))
                ) : (
                  <span className="w-full text-center block font-bold my-6">
                    Không tìm thấy sản phẩm
                  </span>
                )}
              </ul>
            ) : (
              <div className="flex justify-center items-center my-9">
                <PacmanLoader />
              </div>
            )}
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default Search;
