import axios from 'axios';
import {LLM_MODEL_NAME, LOCAL_LLM_URL} from '../config/consts/api';
import {DUMMY_REVIEW_SUMMARY} from '../dummy/reviewSummary';

export const getKakaoReviews = async (placeId: string) => {
  try {
    let reviews = '';
    let hasNext = false;
    let nextCommentId = '';
    const response = await axios.get(
      'https://place.map.kakao.com/main/v/' + placeId,
    );
    hasNext = response.data.comment.hasNext;
    response.data.comment.list.map(rev => {
      reviews += rev.contents + '\n';
    });
    nextCommentId =
      response.data.comment.list[response.data.comment.list.length - 1]
        .commentid;
    while (hasNext) {
      hasNext = false;
      // console.log(
      //   'https://place.map.kakao.com/commentlist/v/' +
      //     placeId +
      //     '/' +
      //     nextCommentId,
      // );
      const res = await axios.get(
        'https://place.map.kakao.com/commentlist/v/' +
          placeId +
          '/' +
          nextCommentId,
      );
      if (res.data) {
        hasNext = res.data.comment?.hasNext;
        res.data.comment?.list.map(rev => {
          if (rev.contents && rev.contents.length > 0)
            reviews += rev.contents + '\n';
        });
        nextCommentId =
          res.data.comment?.list[res.data.comment.list.length - 1].commentid;
      }
    }
    console.log(reviews);
    return reviews;
  } catch (error) {
    console.error(error);
  }
};

export const getReviewSummary = async (placeId: string) => {
  try {
    //FIXME: change url in consts/api.ts
    //FIXME: '다음 리뷰들을 요약해줘 :' 프롬프트 추가 ?
    const reviews = await getKakaoReviews(placeId); //TODO: utilize these reviews from kakao
    const postData = {
      model: LLM_MODEL_NAME,
      prompt: reviews,
      stream: false,
    };
    // const response = await axios.post(
    // `http://${LOCAL_LLM_URL}:11434/api/generate`,
    //   postData,
    // );
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
