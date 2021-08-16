import axios, { AxiosResponse } from 'axios';
// SWR에서 처리 변수가 필요함
const fetcher = (url: string) => {
  axios
    .get(url, {
      // 쿠키생성 (backend와 frontend의 쿠키 공유를 위해 선언)
      // 쿠키는 항상 backend에서 생성해주고 frontend에서 기억을 하도록 만들어줌.
      //frontend에서는 매 요청마다 backend로 보내줌 보내는 역할
      withCredentials: true,
    })
    .then((response: AxiosResponse<any>) => {
      return response.data;
    });
};

export default fetcher;
