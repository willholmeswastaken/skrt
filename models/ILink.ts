import { IDay } from "./IDay";
import { IDeviceAnalytic } from "./IDeviceAnalytic";

export interface ILink {
  id: string;
  url: string;
  unlisted: boolean;
  visitCount: number;
  days: Array<IDay>;
  createdOn: string;
  createdById: string | null;
  deviceAnalytics: Array<IDeviceAnalytic>;
  skrtUrl: string;
}
