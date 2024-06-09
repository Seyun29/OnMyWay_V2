import axios from 'axios';
import {LOCAL_LLM_URL} from '../config/consts/api';
import {DUMMY_REVIEW_SUMMARY} from '../dummy/reviewSummary';

const getKakaoReviews = async (placeId: string) => {
  try {
    const response = await axios.get(LOCAL_LLM_URL); //FIXME: change url in consts/api.ts
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getReviewSummary = async (placeId: string) => {
  try {
    // const response = await axios.get(LOCAL_LLM_URL); //FIXME: change url in consts/api.ts
    const response = await new Promise(resolve =>
      setTimeout(() => {
        resolve({data: DUMMY_REVIEW_SUMMARY});
      }, 1000),
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
