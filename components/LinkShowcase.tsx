import React from "react";

const LinkShowcase = () => {
  return (
    <div className="bg-white shadow-md rounded-lg w-full sm:w-60 transform transition duration-300 hover:scale-105 cursor-pointer">
      <img
        src="https://github.githubassets.com/images/modules/site/home/repo-browser.png"
        className="rounded-lg"
        alt="link image"
      />
      <div className="px-2 py-4">
        <a href="https://github.com" className="text-semibold text-[#7cc2e7]">https://github.com</a>
        <p className="text-gray-700">Created 15 minutes ago</p>
      </div>
    </div>
  );
};

export default LinkShowcase;
