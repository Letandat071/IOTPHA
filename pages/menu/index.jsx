import React from "react";
import MenuWrapper from "../../components/product/MenuWrapper";
import axios from "axios";

const Index = ({ categoryList, productList }) => {
  return (
    <div className="pt-10">
      <MenuWrapper categoryList={categoryList} productList={productList} />
    </div>
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
