import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="flex flex-grow w-full p-6">
      <Link href="/">
        <a className="flex-1 text-4xl text-soft-dark-caption-text dark:text-soft-white-header font-semibold">Skrt.to</a>
      </Link>
      <div>
        <div>
          <a
            href="#"
            className="inline-block text-sm px-4 py-2 leading-none rounded text-soft-white-header bg-soft-dark-light mt-4 lg:mt-0"
          >
            Browse
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
