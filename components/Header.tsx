import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="flex flex-grow w-full p-6">
      <Link href="/">
        <a className="flex-1 text-4xl text-gray-50 font-semibold">Skrt.to</a>
      </Link>
      <div>
        <div>
          <a
            href="#"
            className="inline-block text-sm px-4 py-2 leading-none rounded dark:text-soft-white-caption-text dark:bg-soft-dark-light mt-4 lg:mt-0"
          >
            Browse
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
