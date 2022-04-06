import { Visit } from "@prisma/client";
import UAParser from "ua-parser-js";
import { IDay } from "../models";

export const daysBuilder = ( startDate: Date, numberOfDaysToIncrement: number, visits: Array<Visit> ): Array<IDay> => {
    const days: Array<IDay> = [];
    console.log(visits);
    if(visits.length === 0) return days;
    for (let i = 0; i <= numberOfDaysToIncrement; i++) {
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
          const userAgent = UAParser(iteratedVisit.userAgent!);
          day.visits.push({
            device: userAgent.os.name! ?? "Unknown",
          });
          day.visitCount++;
        }
        days.push(day);
      }
      return days;
};