import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * 今日の日時を取得するAPI
 */
export type TNow = {
  year?: number;
  month?: number;
  date?: number;
  day?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

const Now = (req: NextApiRequest, res: NextApiResponse<TNow>) => {
  const now = new Date();
  res.status(200).json({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    date: now.getDate(),
    day: now.getDay(),
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds()
  });
};

export default Now;
