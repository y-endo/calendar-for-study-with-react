import type { NextApiRequest, NextApiResponse } from 'next';

export type TToday = {
  year: number;
  month: number;
  date: number;
  day: number;
};

const Today = (req: NextApiRequest, res: NextApiResponse<TToday>) => {
  const now = new Date();
  res.status(200).json({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    date: now.getDate(),
    day: now.getDay()
  });
};

export default Today;
