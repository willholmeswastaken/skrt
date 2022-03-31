import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { prisma } from "../../db";

interface ILink {
  id: string;
  url: string;
  unlisted: boolean;
  visitCount: number;
  visits: IDay[];
  createdOn: string;
  createdById: string | null;
}

interface IDay {
  date: string;
  visits: number;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const linkId = params?.linkid;
  let redirectUrl = process.env.HOME_URL;
  try {
    if (linkId) {
      const link = await prisma.link.findUnique({
        where: {
          linkId: linkId.toString(),
        },
      });
      if (link) {
        let today = new Date();
        let startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7
        );
        let totalVisits: Array<IDay> = [];
        const visits = await prisma.visit.findMany({
          where: {
            linkId: link.id,
            visitedAt: {
              gte: startDate,
            },
          },
        });
        for (let i = 0; i < 7; i++) {
          const day = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate() + i
          );
          const dayString = day.toISOString().split("T")[0].split("-");
          totalVisits.push({
            date: `${dayString[1]}-${dayString[2]}`,
            visits: visits.filter(
              (x) => x.visitedAt.toDateString() === day.toDateString()
            ).length,
          });
        }
        const linkViewModel: ILink = {
          id: link.linkId,
          url: link.url,
          visitCount: link.visitCount,
          visits: totalVisits,
          unlisted: link.unlisted,
          createdOn: link.createdOn.toJSON(),
          createdById: link.createdById,
        };
        return {
          props: { link: linkViewModel },
        };
      }

      return {
        redirect: {
          destination: redirectUrl,
        },
        props: {},
      };
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

interface IAnalyticsPageProps {
  link: ILink;
}

const Analytics: NextPage<IAnalyticsPageProps> = ({ link }) => {
  return (
    <div>
      <Head>
        <title>Link Analytics - {link.id}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div>
        <h1 className="font-bold text-4xl text-center text-gray-50 py-10">
          {link.url}
        </h1>
      </div>
      <div>
        <h1 className="font-bold text-3xl text-center sm:text-left text-gray-50 py-10">
          Clicks in the last 7 days
        </h1>
      </div>
      <div className="flex flex-1 h-full bg-white rounded-lg shadow-lg">
        <div className="p-6 h-full w-full">
          <ResponsiveContainer height={400} className="ml-[-25px]">
            <LineChart
              data={link.visits}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line type="monotone" dataKey="visits" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" fontSize={14} />
              <YAxis fontSize={14} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
