import React from 'react';
import type { NextPage, InferGetStaticPropsType } from 'next';
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

export async function getStaticProps() {
  const schedule = await microCMSClient.get<MicroCMSListResponse<TSchedule>>({
    endpoint: 'schedule'
  });

  return {
    props: {
      schedule
    }
  };
}

const Home: NextPage<Props> = ({ schedule }) => {
  const [isModalShow, setIsModalShow] = React.useState(false);

  return (
    <DefaultLayout>
      <Head>
        <title>カレンダー</title>
      </Head>
      <StyledContainer>
        <CalendarMonth schedule={schedule.contents} setIsModalShow={setIsModalShow} />
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

export default Home;
