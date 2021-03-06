import type { GetServerSideProps, NextPage } from "next";
import { lookup } from "geoip-country";
import { prisma } from "../db";

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const linkId: string = params?.linkid!.toString() ?? "";
  let redirectUrl: string = process.env.HOME_URL!.toString();
  try {
    if (linkId) {
      const url = await prisma.link.findUnique({
        where: {
          linkId: linkId.toString(),
        },
      });
      const ipAddress: string =
        req.socket.remoteAddress!.replace("::1", "").replace("127.0.0.1", "") ||
        "77.99.6.131";
      console.log(`Generating country lookup for ${linkId} at ${new Date().toLocaleTimeString()}`);
      const country: string = lookup(ipAddress)?.country ?? "";
      console.log(`Generating visit for ${linkId} at ${new Date().toLocaleTimeString()}`);
      console.timeStamp();
      await prisma.link.update({
        where: { linkId: linkId.toString() },
        data: {
          visitCount: { increment: 1 },
          visits: {
            create: {
              userAgent: req.headers["user-agent"],
              ipAddress: ipAddress,
              country: country,
            },
          },
        },
      });
      console.log(`Generated visit for ${linkId} at ${new Date().toLocaleTimeString()}`);
      redirectUrl = url?.url ?? redirectUrl;
    }
  } catch (err) {
    console.log(err);
  }
  console.log(`Returning at ${new Date().toLocaleTimeString()}`);
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
