import type { NextPage, NextPageContext } from "next";
import { useEffect, useState } from "react";
import { useFlags } from "@happykit/flags/client";
import { getFlags } from "@happykit/flags/server";

import AddLinkForm from "../components/AddLinkForm";
import LinkShowcase from "../components/LinkShowcase";
import UrlGeneratedModal from "../components/UrlGeneratedModal";
import {
  ErrorInitialFlagState,
  Flags,
  SuccessInitialFlagState,
} from "@happykit/flags/dist/declarations/src/types";

export const getServerSideProps = async (context: NextPageContext) => {
  const { initialFlagState } = await getFlags({ context });
  return { props: { initialFlagState } };
};

interface IHomePageProps {
  initialFlagState: SuccessInitialFlagState<Flags> | ErrorInitialFlagState;
}

const Home: NextPage<IHomePageProps> = (props) => {
  const { flags } = useFlags({ initialState: props.initialFlagState });
  const [link, setLink] = useState<string>();
  const [urlLink, setUrlLink] = useState<string>();

  useEffect(() => {
    setUrlLink(`${window.location.protocol}//${window.location.host}/${link}`);
  }, [link]);

  return (
    <div className="p-4 h-full w-full flex justify-center items-center">
      <div className="max-w-4xl rounded-lg w-full px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-bold text-6xl md:text-7xl text-center text-soft-dark-caption-text dark:text-soft-white-header pb-5">
          urls, shortened.
        </h1>
        <AddLinkForm setLink={setLink} />
        {link && <UrlGeneratedModal link={urlLink!} />}
        {flags?.recentskrts && (
          <>
            <div>
              <h1 className="font-bold text-4xl text-center sm:text-left text-soft-dark-caption-text dark:text-soft-white-header py-10">
                Recent Skrts
              </h1>
            </div>
            <div className="flex flex-col flex-wrap sm:flex-row gap-14">
              <LinkShowcase />
              <LinkShowcase />
              <LinkShowcase />
              <LinkShowcase />
              <LinkShowcase />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
