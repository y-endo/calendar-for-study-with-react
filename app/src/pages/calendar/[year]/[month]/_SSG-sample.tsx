import React from 'react';
import type { NextPage, InferGetStaticPropsType, GetStaticProps } from 'next';
import { MicroCMSListResponse } from 'microcms-js-sdk';
import styled from 'styled-components';
import TSchedule from '~/types/Schedule';
import Head from 'next/head';
import DefaultLayout from '~/components/layouts/Default';
import CalendarMonth from '~/components/Calendar/month';
import ScheduleList from '~/components/ScheduleList';
import Modal from '~/components/Modal';
import microCMSClient from '~/utils/microCMSClient';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const schedule = await microCMSClient.get<MicroCMSListResponse<TSchedule>>({
    endpoint: 'schedule'
  });

  const today = new Date();
  let year = params ? params.year : String(today.getFullYear());
  let month = params ? params.month : String(today.getMonth() + 1);

  if (year && month) {
    if (!(isNaN(Number(year)) && isNaN(Number(month)))) {
      if (year.length !== 4) {
        year = String(today.getFullYear());
      }
      if (month.length > 2) {
        month = String(today.getMonth() + 1);
      }
    }
  }

  return {
    props: {
      year,
      month,
      schedule
    }
  };
};

export const getStaticPaths = () => {
  // ここを動的に作る[1999...2022]
  return {
    paths: [
      {
        params: {
          year: '2022',
          month: '3'
        }
      }
    ],
    fallback: false
  };
};

const Month: NextPage<Props> = ({ year, month, schedule }) => {
  const [isModalShow, setIsModalShow] = React.useState(false);

  return (
    <DefaultLayout>
      <Head>
        <title>カレンダー</title>
      </Head>
      <StyledContainer>
        <CalendarMonth
          year={parseInt(year as string, 10)}
          month={parseInt(month as string, 10)}
          schedule={schedule.contents}
          setIsModalShow={setIsModalShow}
        />
        <ScheduleList data={schedule.contents} />
        <Modal isShow={isModalShow} setIsShow={setIsModalShow}>
          予定登録
        </Modal>
      </StyledContainer>
    </DefaultLayout>
  );
};

const StyledContainer = styled.div`
  display: flex;
  align-items: stretch;
`;

export default Month;
