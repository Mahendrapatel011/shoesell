// src/components/ShoeModelViewer.jsx

import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import './ShoeModelViewer.css'; // We will create this CSS file next

// import required modules
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';

// You can replace these with dynamic images from your featured products
const shoeModels = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80',
  'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&q=80',
];

export default function ShoeModelViewer() {
  return (
    <div className="shoe-viewer-container">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        direction={'vertical'}
        slidesPerView={3}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 10,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
      >
        {shoeModels.map((src, index) => (
          <SwiperSlide key={index}>
            <img src={src} alt={`Shoe Model ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}