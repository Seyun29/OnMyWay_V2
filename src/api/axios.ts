import axios, {AxiosError} from 'axios';
import {BASE_URL} from '../config/consts/api';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async (error: AxiosError) => {
    onError(error, error?.config?.url);
    return Promise.reject(error);
  },
);

const onError = (err: AxiosError, apiUrl: string | undefined) => {
  console.log('Response error', err.message);
  if (err.response) {
    console.log(
      apiUrl,
      ': ',
      '요청이 이루어 졌으나 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.',
      err.response,
    );
  } else if (err.request) {
    console.log(
      apiUrl,
      ': ',
      '요청이 이루어 졌으나 응답을 받지 못했습니다.',
      err.request._response,
    );
  } else {
    console.log(
      apiUrl,
      ': ',
      '오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.',
      err.message,
    );
  }
};
