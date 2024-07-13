import Image from "next/image";
import Title from "./ui/Title";
import Slider from "react-slick";
import { useRouter } from "next/router";

const Carousel = () => {
  const router = useRouter();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 30000,
    appendDots: (dots) => (
      <div>
        <ul>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div className="w-3 h-3 border bg-white rounded-full mt-10"></div>
    ),
  };

  const handleMenuRedirect = () => {
    router.push('/menu');
  };

  return (
    <div className="h-screen w-full container mx-auto -mt-[88px]">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="relative h-full w-full">
          <Image
            src="/images/banner.png"
            alt="Hình ảnh về nhà hàng"
            layout="fill"
            priority
            objectFit="cover"
          />
        </div>
      </div>
      <Slider {...settings}>
        <div>
          <div className="mt-48 text-white flex flex-col items-start gap-y-10">
            <Title addClass="text-6xl">Nhà Hàng PHA</Title>
            <p className="text-sm sm:w-2/5 w-full">
              Chào mừng bạn đến với Nhà Hàng PHA, nơi mỗi món ăn đều được chế biến từ những nguyên liệu tươi ngon nhất, đảm bảo mang đến cho bạn hương vị tuyệt vời và trải nghiệm ẩm thực độc đáo. Từ các món ăn truyền thống đến những sáng tạo hiện đại, chúng tôi luôn nỗ lực để làm hài lòng thực khách với chất lượng và dịch vụ hoàn hảo.
            </p>
            <button className="btn-primary" onClick={handleMenuRedirect}>Đặt Món Ngay</button>
          </div>
        </div>
        <div>
          <div className="relative text-white top-48 flex flex-col items-start gap-y-10">
            <Title addClass="text-6xl">Khám Phá Hương Vị</Title>
            <p className="text-sm sm:w-2/5 w-full">
              Đến với chúng tôi, bạn sẽ được thưởng thức những món ăn đặc sắc, từ những món hải sản tươi sống đến các món thịt nướng thơm lừng, mỗi món đều mang đậm dấu ấn của đội ngũ đầu bếp tài hoa. Chúng tôi luôn tìm kiếm sự mới mẻ và sáng tạo để mang lại những trải nghiệm ẩm thực không thể quên.
            </p>
            <button className="btn-primary" onClick={handleMenuRedirect}>Khám Phá Ngay</button>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
