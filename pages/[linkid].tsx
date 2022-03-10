import type { GetServerSideProps, NextPage } from "next";
import { prisma } from "../db";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const linkId = params?.linkid;
  let redirectUrl = process.env.HOME_URL;
  try {
    if (linkId) {
      const url = await prisma.link.findUnique({
        where: {
          linkId: linkId.toString(),
        },
      });
      redirectUrl = url?.url ?? redirectUrl;
    }
  } catch (err) {
    console.log(err);
  }
  return {
    redirect: {
      destination: redirectUrl,
    },
    props: {},
  };
};

const Link: NextPage = () => {
  return <div>Link</div>;
};

export default Link;