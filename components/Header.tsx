import Link from "next/link";
import React, { useState } from "react";
import SearchModal from "./SearchModal";

const Header = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const presentSearch: () => void = () => setShowSearch(true);
  return (
    <div className="flex flex-grow w-full p-6">
      <Link href="/">
        <a className="flex-1 text-4xl text-soft-dark-caption-text dark:text-soft-white-header font-semibold">Skrt.to</a>
      </Link>
      <div>
        <div>
          <button
            type='button'
            onClick={presentSearch}
            className="inline-block text-sm px-4 py-2 leading-none rounded text-soft-white-header bg-soft-dark-light mt-4 lg:mt-0"
            >Search</button>
        </div>
        <SearchModal open={showSearch} setOpen={setShowSearch} />
      </div>
    </div>
  );
};

export default Header;
