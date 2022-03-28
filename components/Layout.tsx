import React from "react";
import Header from "./Header";

const Layout: React.FC = ({ children }) => {
  return (
    <div className="h-screen w-screen">
      <div className="container mx-auto">
        <Header />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
