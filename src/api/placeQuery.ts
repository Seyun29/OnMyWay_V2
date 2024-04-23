import {axiosInstance} from './axios';
import {PLACE_QUERY} from '../config/consts/api';

export const placeQuery = async (query: string) => {
  try {
    const response = await axiosInstance.get(PLACE_QUERY, {
      params: {
        query,
      },
    });
    return response.data?.data;
  } catch (error) {
    console.log('placeQuery error, Params: ', query);
  }
};
