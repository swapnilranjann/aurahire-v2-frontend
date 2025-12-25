import React, { Fragment } from "react";
import Routers from "../../routers/Routers";
import Header from "../header/Header";
import Footer from "../footer/Footer";

const Layout = () => {
  return (
    <Fragment>
      <Header />
      <main id="main-content" role="main" tabIndex="-1">
        <Routers />
      </main>
      <Footer />
    </Fragment>
  );
};

export default Layout;
