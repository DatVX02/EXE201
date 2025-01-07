import React from 'react';
import { Carousel } from 'antd';
import logo from "../../../assets/banner-f12-v3.png";
const contentStyle = {
  height: '550px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',

};
const ADS = () => (
  <>
    <Carousel autoplay>
      <div>
        <h3 style={contentStyle}>
          <img src={logo} alt="logo" className='h-[100%] w-[100%]' />
        </h3>
      </div>
      <div>
        <h3 style={contentStyle}><img src={logo} alt="logo" className='h-[100%] w-[100%]' /></h3>
      </div>
      <div>
        <h3 style={contentStyle}><img src={logo} alt="logo" className='h-[100%] w-[100%]' /></h3>
      </div>
      <div>
        <h3 style={contentStyle}><img src={logo} alt="logo" className='h-[100%] w-[100%]' /></h3>
      </div>
    </Carousel>
  </>
);
export default ADS;