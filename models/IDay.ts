import { IVisit } from "./IVisit";

export interface IDay {
  date: string;
  visits: Array<IVisit>;
  visitCount: number;
}
