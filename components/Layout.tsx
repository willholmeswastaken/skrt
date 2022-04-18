import React from "react";
import Header from "./Header";

const Layout = ({ children }: any) => {
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="container mx-auto flex-grow">
        <Header />
        <div className="p-6">{children}</div>
      </div>
      <footer className="dark:bg-soft-dark dark:text-soft-white-caption-text text-soft-dark-caption-text text-center">Free, forever. <br /> Made by <a href='https://willholmes.dev'>Will Holmes</a></footer>
    </div>
  );
};

export default Layout;
