/**
 * useSWRで使うfetcherをまとめたもの
 */

import { MicroCMSListResponse, MicroCMSListContent, MicroCMSQueries } from 'microcms-js-sdk';
import TSchedule from '~/types/Schedule';
import type { TNow } from '~/pages/api/now';

import { microCMSClient } from '~/utils/microCMS';

/**
 * 今日の日付を取得する
 * @param endpoint
 */
export const nowFetcher = (endpoint: string): Promise<TNow> => fetch(endpoint).then(res => res.json());

/**
 * 予定データを取得する
 * @param endpoint
 * @param queries
 */
export const schedulesFetcher = (endpoint: string, queries: MicroCMSQueries = {}) =>
  microCMSClient.get<MicroCMSListResponse<TSchedule>>({ endpoint, queries });

/**
 * IDが一致する予定データ1件を取得する
 * @param endpoint
 * @param contentId
 */
export const scheduleFetcher = (endpoint: string, contentId: string) => microCMSClient.get<MicroCMSListContent & TSchedule>({ endpoint, contentId });
