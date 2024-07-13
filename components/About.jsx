import Image from "next/image";
import Title from "./ui/Title";

const About = () => {
  return (
    <div className="bg-secondary py-14">
      <div className="container mx-auto flex items-center text-white gap-20 justify-center flex-wrap-reverse">
        <div className="flex justify-center">
          <div className="relative sm:w-[445px] sm:h-[600px]  flex justify-center w-[300px] h-[450px]">
            <Image src="/images/about-img.png" alt="Hình ảnh về chúng tôi" layout="fill" />
          </div>
        </div>
        <div className="md:w-1/2 ">
          <Title addClass="text-[40px]">Chúng Tôi Là PHA Restaurant</Title>
          <p className="my-5 flex flex-col items-center">
            Tại nhà hàng của chúng tôi, mỗi món ăn không chỉ là sự kết hợp tinh tế của nguyên liệu tươi ngon và công thức nấu ăn đặc biệt, mà còn là sự kết tinh của niềm đam mê và tình yêu với ẩm thực. Chúng tôi tin rằng mỗi bữa ăn là một trải nghiệm ẩm thực đáng nhớ, nơi mà hương vị đậm đà hòa quyện với không gian ấm cúng, mang đến cho bạn những khoảnh khắc thực sự trọn vẹn.
            <br /><br />
            Với sự tận tâm và sáng tạo, đội ngũ đầu bếp của chúng tôi luôn nỗ lực để mang đến cho bạn những món ăn độc đáo và phong phú, từ những món ăn truyền thống đến các món ăn hiện đại, tất cả đều được chế biến với sự tỉ mỉ và kỹ thuật cao.
          </p>
          <button className="btn-primary">Xem Thêm</button>
        </div>
      </div>
    </div>
  );
};

export default About;
