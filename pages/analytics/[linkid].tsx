import type { GetServerSideProps, NextPage } from "next";
import { Visit } from "@prisma/client";
import Head from "next/head";
import { prisma } from "../../db";
import { IDay, IVisit, ILink } from "../../models";
import { groupByDevice, daysBuilder } from "../../utilities";
import ClicksGraph from "../../components/ClicksGraph";
import DeviceAnalyticsChart from "../../components/DeviceAnalyticsChart";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import CopyLink from "../../components/CopyLink";

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
          if (day.visits === undefined) continue;
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
          skrtUrl: `${process.env.HOME_URL}/${linkId}`,
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
  const title = "View my link";
  return (
    <div>
      <Head>
        <title>Link Analytics - {link.id}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/2 bg-white dark:bg-soft-dark-light rounded-lg shadow-sm">
              <h2 className="text-soft-dark-caption-text dark:text-soft-white-header text-xl font-semibold p-4">
                Target Url
              </h2>
              <p className="text-soft-dark-caption-text dark:text-soft-white-caption-text whitespace-normal px-4 pb-4 flex flex-row gap-x-2 ">
                {link.url}
                <CopyLink link={link.skrtUrl} />
              </p>
            </div>
            <div className="w-full md:w-1/2 bg-white dark:bg-soft-dark-light rounded-lg shadow-sm">
              <h2 className="text-soft-dark-caption-text dark:text-soft-white-header text-xl font-semibold p-4">
                Share via socials
              </h2>
              <div className="flex flex-row px-4 pb-4 gap-2">
                <TwitterShareButton url={link.skrtUrl} title={title}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <FacebookShareButton url={link.skrtUrl} quote={title}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TelegramShareButton url={link.skrtUrl} title={title}>
                  <TelegramIcon size={32} round />
                </TelegramShareButton>
                <WhatsappShareButton
                  url={link.skrtUrl}
                  title={title}
                  separator=":: "
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <RedditShareButton
                  url={link.skrtUrl}
                  title={title}
                  windowWidth={660}
                  windowHeight={460}
                >
                  <RedditIcon size={32} round />
                </RedditShareButton>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full gap-4">
            <div className="flex flex-col w-full md:w-1/2 h-full bg-white dark:bg-soft-dark-light rounded-lg shadow-sm">
              <div className="p-6">
                <ClicksGraph days={link.days} />
              </div>
            </div>
            <div className="flex flex-col h-full w-full md:w-1/2 bg-white dark:bg-soft-dark-light rounded-lg shadow-sm">
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
