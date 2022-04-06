import { IDeviceAnalytic } from "../models";

export const groupByDevice = (data: any[], key: string) => {
  let res: any = data.reduce((previousValue, currentValue) => {
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

