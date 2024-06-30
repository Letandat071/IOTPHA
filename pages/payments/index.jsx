import React, { useState } from "react";
import Order from "../../components/profile/Order";

const Index = () => {
  const [dropdown1, setDropdown1] = useState(false);
  const [dropdown2, setDropdown2] = useState(false);
  const [dropdown3, setDropdown3] = useState(false);
  const [changeText1, setChangeText1] = useState("City");

  const HandleText1 = (e) => {
    setChangeText1(e);
    setDropdown1(false);
  };

  return (
    <div className="overflow-y-hidden">
      <Order />
    </div>
  );
};

export default Index;