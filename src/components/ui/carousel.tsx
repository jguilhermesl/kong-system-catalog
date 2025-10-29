import { FreeMode, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { ReactNode } from 'react';

interface ICarouselProps {
  children: ReactNode;
  classNameItem?: string;
}

export const Carousel = ({ children, classNameItem }: ICarouselProps) => {
  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <Swiper
      slidesPerView={'auto'}
      spaceBetween={32}
      freeMode={true}
      modules={[FreeMode, Pagination]}
      className="mt-4 px-4"
    >
      {childrenArray.map((item, index) => (
        <SwiperSlide
          key={index}
          style={{
            height: 'auto',
          }}
          className={classNameItem}
        >
          {item}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
