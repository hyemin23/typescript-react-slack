import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import useSWR, { mutate } from 'swr';

// layout이기 때문에 children
// children을 사용하는 컴포넌트 type : FC
// children을 사용하지 않는 컴포넌트 type : VFC
// type error는 FC로 가져오면 됨
const Workspace = () => {
  const {
    data: userData,
    error: loginError,
    revalidate: revalidateUser,
    mutate,
  } = useSWR('/api/users', fetcher, {
    // dedupingInterval안에 요청을 하면 미리 캐싱된 data를 돌려줌
    dedupingInterval: 100000,
  });

  const onLogOut = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false);
        // revalidateUser();
      })
      .catch((error) => {
        console.dir(error);
      });
  }, []);

  // 로그아웃이 되는 순간 data는 false가 되므로
  if (!userData) {
    console.log(userData);
    return <Redirect to="/login" />;
  }
  return (
    <div>
      요기누르기
      <button onClick={onLogOut}>로그아웃</button>
    </div>
  );
};

export default Workspace;
