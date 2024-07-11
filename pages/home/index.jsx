import React from "react";
import About from "../../components/About";
import Campaigns from "../../components/Campaigns";
import Carousel from "../../components/Carousel";
import MenuWrapper from "../../components/product/MenuWrapper";
import axios from "axios";

const Index = ({ categoryList, productList }) => {
  // In ra dữ liệu để kiểm tra
  // console.log("categoryList: ", categoryList);
  // console.log("productList: ", productList);

  return (
    <React.Fragment>
      <Carousel />
      <Campaigns />
      <MenuWrapper categoryList={categoryList} productList={productList} />
      <About />
    </React.Fragment>
  );
};

export const getServerSideProps = async () => {
  try {
    const categoryRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`
    );
    const productRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products`
    );

    const categoryList = categoryRes.data ? categoryRes.data : [];
    const productList = productRes.data ? productRes.data : [];

    return {
      props: {
        categoryList,
        productList,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        categoryList: [],
        productList: [],
      },
    };
  }
};

export default Index;
