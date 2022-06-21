export type TMonthCalendar = {
  year: number;
  month: number;
  date: number;
  day: string;
};
const getMonthCalendarData = (year: number, month: number): TMonthCalendar[] => {
  const data: TMonthCalendar[] = [];
  const week = ['日', '月', '火', '水', '木', '金', '土'];
  const lastMonth = month === 1 ? 12 : month - 1;
  const nextMonth = month === 12 ? 1 : month + 1;
  const startDayOfWeek = new Date(year, month - 1, 1).getDay();
  const endDate = new Date(year, month - 2, 0).getDate();
  const lastMonthEndDate = new Date(year, month, 0).getDate();
  const row = 6;
  let count = 0;

  for (let i = 0; i < row; i++) {
    week.map((day, index) => {
      let currentYear = year;
      let currentMonth = month;
      let currentDate = -1;

      if (i == 0 && index < startDayOfWeek) {
        // 先月末の日にち
        if (lastMonth === 1) {
          currentYear -= 1;
        }
        currentMonth = lastMonth;
        currentDate = lastMonthEndDate - startDayOfWeek + index + 1;
      } else if (count >= endDate) {
        // 来月頭の日にち
        count++;
        if (nextMonth === 1) {
          currentYear += 1;
        }
        currentMonth = nextMonth;
        currentDate = count - endDate;
      } else {
        // 今月の日にち
        count++;
        currentDate = count;
      }

      data.push({
        year: currentYear,
        month: currentMonth,
        date: currentDate,
        day
      });
    });
  }

  return data;
};

export default getMonthCalendarData;
