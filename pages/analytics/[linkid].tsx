import type { GetServerSideProps, NextPage } from "next";
import { Visit } from "@prisma/client";
import Head from "next/head";
import parser from "ua-parser-js";
import { prisma } from "../../db";
import { IDay, IDeviceAnalytic, IVisit, ILink } from "../../models";
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
        let today = new Date();
        let startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7
        );
        let days: Array<IDay> = [];
        const visits = await prisma.visit.findMany({
          where: {
            linkId: link.id,
            visitedAt: {
              gte: startDate,
            },
          },
        });
        for (let i = 0; i < 7; i++) {
          const iteratedDay: Date = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate() + i
          );
          const dayString: string[] = iteratedDay
            .toISOString()
            .split("T")[0]
            .split("-");
          const day: IDay = {
            date: `${dayString[1]}-${dayString[2]}`,
            visits: [],
            visitCount: 0,
          };
          var visitsOnDay: Visit[] = visits.filter(
            (x) => x.visitedAt.toDateString() === iteratedDay.toDateString()
          );
          for (let i = 0; i < visitsOnDay.length; i++) {
            const iteratedVisit: Visit = visitsOnDay[i];
            const userAgent = parser(iteratedVisit.userAgent!);
            day.visits.push({
              device: userAgent.os.name! ?? "Unknown",
            });
            day.visitCount++;
          }
          days.push(day);
        }
        var groupBy = function (data: any[], key: string) {
          let res: any = data.reduce(function (previousValue, currentValue) {
            (previousValue[currentValue[key]] =
              previousValue[currentValue[key]] || []).push(1);
            return previousValue;
          }, {});
          let arr: Array<IDeviceAnalytic> = [];
          for (let i = 0; i < Object.keys(res).length; i++) {
            arr.push({
              name: Object.keys(res)[i],
              count: Object.values(res)[i].length,
            });
          }
          return arr;
        };

        let totalVisits: Array<IVisit> = [];
        for (let i = 0; i < days.length; i++) {
          const day = days[i];
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
          deviceAnalytics: groupBy(totalVisits, "device"),
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
            <div className="bg-white dark:bg-soft-dark-light rounded-lg shadow-md">
              <h2 className="text-black dark:text-soft-white-header text-xl font-semibold p-4">
                Target Url
              </h2>
              <p className="text-black dark:text-soft-white-caption-text whitespace-normal px-4 pb-4">
                {link.url}
              </p>
            </div>
          </div>
          <div className="flex flex-col w-full md:w-2/4 gap-y-4">
            <div className="flex flex-col flex-1 h-full bg-white dark:bg-soft-dark-light rounded-lg shadow-md">
              <div className="p-6">
                <ClicksGraph days={link.days} />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full md:w-2/4 gap-y-4">
            <div className="flex flex-col flex-1 h-full bg-white dark:bg-soft-dark-light rounded-lg shadow-md">
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
