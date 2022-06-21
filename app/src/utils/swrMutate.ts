import { mutate } from 'swr';
import store from '~/stores';

/**
 * 月カレンダーページに表示する予定をswrのmutateで更新する。
 */
export const monthScheduleMutate = () => {
  const { microCMSQueries } = store.getState();

  if (Object.keys(microCMSQueries.monthCalendar).length) {
    mutate(['schedule', microCMSQueries.monthCalendar]);
  }
};

/**
 * 予定一覧ページに表示する予定をswrのmutateで更新する。
 */
export const scheduleListMutate = () => {
  const { microCMSQueries } = store.getState();

  if (Object.keys(microCMSQueries.scheduleList).length) {
    mutate(['schedule', microCMSQueries.scheduleList]);
  }
};
