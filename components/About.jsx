import Image from "next/image";
import Title from "./ui/Title";

const About = () => {
  return (
    <div className="bg-secondary py-14">
      <div className="container mx-auto flex items-center text-white gap-20 justify-center flex-wrap-reverse">
        <div className="flex justify-center">
          <div className="relative sm:w-[445px] sm:h-[600px]  flex justify-center w-[300px] h-[450px]">
            <Image src="/images/about-img.png" alt="" layout="fill" />
          </div>
        </div>
        <div className="md:w-1/2 ">
          <Title addClass="text-[40px]">We Are PHA</Title>
          <p className="my-5 flex flex-col items-center">
          Trong môi trường kinh doanh ngày nay, pha distribution đang ngày càng được chú trọng và phát triển nhờ vào sự tiến bộ của công nghệ thông tin và mạng lưới vận chuyển, mang lại những cơ hội mới và thách thức cho các doanh nghiệp để nâng cao khả năng cạnh tranh và phát triển bền vững.







          </p>
          <button className="btn-primary">Xem Thêm</button>
        </div>
      </div>
    </div>
  );
};

export default About;
