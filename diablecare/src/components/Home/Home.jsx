import React from "react";
import Header from "../Header/Header";
import ADS from "../Homepage/ADS/ADS";
import Brand from "../Homepage/Brand/Brand";

const Home = () => {
    return (
        <>
            <Header />
            <ADS />
            <div>
                <h1>Đối Tác</h1>
                <Brand/>
            </div>
        </>
    );
}
export default Home;