import { IDM } from '@typings/db';
import dayjs from 'dayjs';
import React from 'react';

export default function makeSection(chatList: IDM[]) {
  // { 'hello': [{ id: 1 }, { id: 2 }] }
  const sections: { [key: string]: IDM[] } = {};

  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');

    //   날짜 : key, value : 배열 객체
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });
  return sections;
}
