import React from 'react';
import { Carousel } from 'antd';
import logo from "../../../assets/banner-f12-v3.png";
const contentStyle = {
  margin: 0,
  height: '700px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};
const ADS = () => (
  <>
    <Carousel arrows infinite={false}>
      <div>
        <h3 style={contentStyle}>
          <img src={logo} />
        </h3>
      </div>
      <div>
        <h3 style={contentStyle}><h3 style={contentStyle}>
          <img src={logo} />
        </h3></h3>
      </div>
      <div>
        <h3 style={contentStyle}><h3 style={contentStyle}>
          <img src={logo} />
        </h3></h3>
      </div>
      <div>
        <h3 style={contentStyle}><h3 style={contentStyle}>
          <img src={logo} />
        </h3></h3>
      </div>
    </Carousel>
  </>
);
export default ADS;