import type { GetServerSideProps, NextPage } from "next";
import { Visit } from "@prisma/client";
import Head from "next/head";
import { prisma } from "../../db";
import { IDay, IVisit, ILink } from "../../models";
import { groupByDevice, daysBuilder } from '../../utilities';
import ClicksGraph from "../../components/ClicksGraph";
import DeviceAnalyticsChart from "../../components/DeviceAnalyticsChart";

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
        let today: Date = new Date();
        const daysDifference: number = 7;
        let startDate: Date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - daysDifference
        );
        const visits: Array<Visit> = await prisma.visit.findMany({
          where: {
            linkId: link.id,
            visitedAt: {
              gte: startDate,
            },
          },
        });
        let days: Array<IDay> = daysBuilder(startDate, daysDifference, visits);

        let totalVisits: Array<IVisit> = [];
        for (let i = 0; i < days.length; i++) {
          const day: IDay = days[i];
          console.log(day)
          if(day.visits === undefined) continue;
          totalVisits = totalVisits.concat(day.visits);
        }

        const linkViewModel: ILink = {
          id: link.linkId,
          url: link.url,
          visitCount: link.visitCount,
          days: days,
          unlisted: link.unlisted,
          createdOn: link.createdOn.toJSON(),
          createdById: link.createdById,
          deviceAnalytics: groupByDevice(totalVisits, "device"),
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
        <div className="flex md:flex-row flex-col gap-4">
          <div className="w-full md:w-1/4">
            <div className="bg-white dark:bg-soft-dark-light rounded-lg shadow-sm">
              <h2 className="text-soft-dark-caption-text dark:text-soft-white-header text-xl font-semibold p-4">
                Target Url
              </h2>
              <p className="text-soft-dark-caption-text dark:text-soft-white-caption-text whitespace-normal px-4 pb-4">
                {link.url}
              </p>
            </div>
          </div>
          <div className="flex flex-col w-full md:w-2/4 gap-y-4">
            <div className="flex flex-col flex-1 h-full bg-white dark:bg-soft-dark-light rounded-lg shadow-sm">
              <div className="p-6">
                <ClicksGraph days={link.days} />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full md:w-2/4 gap-y-4">
            <div className="flex flex-col flex-1 h-full bg-white dark:bg-soft-dark-light rounded-lg shadow-sm">
              <div className="p-6">
                <DeviceAnalyticsChart deviceAnalytics={link.deviceAnalytics} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
