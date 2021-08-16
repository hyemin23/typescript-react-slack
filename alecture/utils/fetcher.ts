import axios, { AxiosResponse } from 'axios';
// SWR에서 처리 변수가 필요함
const fetcher = (url: string) => {
  return axios.get(url, { withCredentials: true }).then((response: AxiosResponse<any>) => response.data);
};

export default fetcher;
