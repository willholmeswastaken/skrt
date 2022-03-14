import type { NextPage } from "next";
import { useEffect, useState } from "react";
import AddLinkForm from "../components/AddLinkForm";
import Header from "../components/Header";
import UrlGeneratedModal from "../components/UrlGeneratedModal";

const Home: NextPage = () => {
  const [link, setLink] = useState<string>();
  const [urlLink, setUrlLink] = useState<string>();
  useEffect(() => {
    setUrlLink(`${window.location.protocol}//${window.location.host}/${link}`);
  }, [link]);

  return (
    <div className="h-screen w-screen bg-[#84ccff] overflow-y-hidden">
      <Header />
      <div className="p-4 h-full w-full flex">
        <div className="max-w-2xl rounded-lg w-full">
          <div className="px-4 sm:px-6 lg:px-8 py-20">
            <h1 className="font-bold text-6xl md:text-8xl text-gray-50">
              Urls, Shortened.
            </h1>
            <AddLinkForm setLink={setLink} />
            {link && (
              <UrlGeneratedModal link={urlLink!} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
