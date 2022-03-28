import { Link, Visit } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
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
        const visits = await prisma.visit.findMany({
          where: {
            linkId: link.id,
          },
        });
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth();
        let date = today.getDate();
        let lastThirtyDays: Array<IDay> = [];
        console.log(visits)
        for (let i = 0; i < 7; i++) {
          const day = new Date(year, month, date - 6 + i);
          const dayString = day.toISOString().split("T")[0].split("-");
          lastThirtyDays.push({
            date: `${dayString[1]}-${dayString[2]}`,
            visits: visits.filter(
              (x) => x.visitedAt.toDateString() === day.toDateString()
            ).length,
          });
        }
        console.log(visits);
        const linkViewModel: ILink = {
          id: link.linkId,
          url: link.url,
          visitCount: link.visitCount,
          visits: lastThirtyDays,
          unlisted: link.unlisted,
          createdOn: link.createdOn.toJSON(),
          createdById: link.createdById,
        };

        console.log(linkViewModel);
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
          <ResponsiveContainer height={400} className="">
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
