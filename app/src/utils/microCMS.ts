/**
 * microCMSのAPIをまとめたもの
 */

import { createClient } from 'microcms-js-sdk';

import TSchedule from '~/types/Schedule';

/**
 * microCMS 公式SDKクライアント
 */
export const microCMSClient = createClient({
  serviceDomain: 'calendar',
  apiKey: process.env.API_KEY || ''
});

/**
 * 予定データを登録する（POST）
 * @param data
 */
export const postSchedule = (data: Omit<TSchedule, 'id'>) => {
  return fetch('https://calendar.microcms.io/api/v1/schedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-MICROCMS-API-KEY': process.env.API_KEY || ''
    },
    body: JSON.stringify(data)
  });
};

/**
 * 予定データを更新する（PATCH）
 * @param data
 */
export const patchSchedule = (contentId: string, data: Omit<TSchedule, 'id'>) => {
  return fetch(`https://calendar.microcms.io/api/v1/schedule/${contentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-MICROCMS-API-KEY': process.env.API_KEY || ''
    },
    body: JSON.stringify(data)
  });
};

/**
 * 予定データを削除する（DELETE）
 * @param contentId
 */
export const deleteSchedule = (contentId: string) => {
  return fetch(`https://calendar.microcms.io/api/v1/schedule/${contentId}`, {
    method: 'DELETE',
    headers: {
      'X-MICROCMS-API-KEY': process.env.API_KEY || ''
    }
  });
};
