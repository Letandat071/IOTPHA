import Image from "next/image";
import Title from "./ui/Title";
import Slider from "react-slick";

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 30000,
    appenDots: (dots) => (
      <div>
        <ul>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div className="w-3 h-3 border bg-white rounded-full mt-10"></div>
    ),
  };

  return (
    <div className="h-screen w-full container mx-auto -mt-[88px]">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="relative h-full w-full">
          <Image
            src="/images/banner.png"
            alt=""
            layout="fill"
            priority
            objectFit="cover"
          />
        </div>
      </div>
      <Slider {...settings}>
        <div>
          <div className="mt-48  text-white flex flex-col items-start gap-y-10">
            <Title addClass="text-6xl">Nhà Hàng PHA</Title>
            <p className="text-sm sm:w-2/5 w-full">
            Quản lý hiệu quả PHA Distribution giúp các doanh nghiệp tối ưu hóa chi phí vận chuyển và lưu trữ, cải thiện sự linh hoạt trong cung ứng sản phẩm, tăng cường quản lý tồn kho, và đảm bảo sự phục vụ khách hàng nhanh chóng và hiệu quả. Đồng thời, nó cũng đóng vai trò quan trọng trong việc xây dựng và duy trì mối quan hệ với các đối tác trong chuỗi cung ứng, từ đó tối đa hóa giá trị và lợi ích cho tất cả các bên liên quan.


            </p>
            <button className="btn-primary">Đặt Món Ngay</button>
          </div>
        </div>
        <div>
          <div className="relative text-white top-48 flex flex-col items-start gap-y-10">
            <Title addClass="text-6xl">Nhà Hàng PHA</Title>
            <p className="text-sm sm:w-2/5 w-full">
            Trong PHA Distribution, các bên liên quan như nhà sản xuất, nhà phân phối, nhà bán lẻ và người tiêu dùng đóng vai trò quan trọng. Các kênh phân phối có thể bao gồm các mô hình như bán lẻ truyền thống, bán hàng qua mạng (online), hoặc sử dụng các trung gian như nhà phân phối độc quyền, đại lý, đại lý phân phối, và các hệ thống bán hàng đa cấp.


            </p>
            <button className="btn-primary">Đặt Món Ngay</button>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
