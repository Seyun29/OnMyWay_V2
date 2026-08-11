import {getKakaoPlace} from './getKakaoPlace';

export const getExtraPlaceData = async (placeId: string) => {
  try {
    const res = await getKakaoPlace(placeId);
    return {
      open:
        res?.business_hours?.real_time_info?.business_hours_status?.code ===
        'OPEN',
      tags: res?.place_add_info?.tags,
      photoUrl: res?.photos?.photos[0]?.url
        ? res.photos.photos[0].url.replace(/^http:\/\//i, 'https://')
        : null,
      commentCnt: res?.kakaomap_review?.score_set?.review_count,
      reviewCnt: res?.blog_review?.review_count,
      parking: res?.place_add_info?.facilities?.is_parking,
      scoreAvg: res?.kakaomap_review?.score_set?.average_score,
    };
  } catch {
    return {};
  }
};
