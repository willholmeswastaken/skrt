import type { NextPage } from "next";
import { useEffect, useState } from "react";
import AddLinkForm from "../components/AddLinkForm";

const Home: NextPage = () => {
  const [link, setLink] = useState<string>();
  const [urlLink, setUrlLink] = useState<string>();
  useEffect(() => {
    setUrlLink(`${window.location.protocol}//${window.location.host}/${link}`);
  }, [link])

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-2xl bg-white rounded-lg w-full">
        <div className="px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="font-bold text-4xl text-gray-900">Welcome to Skrt</h1>
          <AddLinkForm setLink={setLink} />
          {
            link &&
            <div className="bg-indigo-50 rounded-full px-4 py-4 mt-4">
              <a href={urlLink}>{urlLink}</a>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
