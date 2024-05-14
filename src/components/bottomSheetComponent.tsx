//@ts-ignore
import React from 'react';
import {View, Text, Image} from 'react-native';
import StarFilledSVG from '../assets/images/starFilled.svg';
import StarUnFilledSVG from '../assets/images/starUnfilled.svg';

function Stars({scoreAvg}: {scoreAvg: number}) {
  const stars = [<StarFilledSVG key={1} />];
  for (let i = 2; i <= 5; i++) {
    if (i <= scoreAvg) {
      stars.push(<StarFilledSVG key={i} />);
    } else {
      stars.push(<StarUnFilledSVG key={i} />);
    }
  }
  return stars;
}

export default function BottomSheetComponent({placeInfo}: {placeInfo: any}) {
  const {
    place_name,
    address_name,
    open,
    tags,
    photoUrl,
    commentCnt,
    reviewCnt,
    scoreAvg,
  } = placeInfo;

  return (
    <View className="flex-1 flex-row w-full px-5 py-2">
      <Image
        source={
          photoUrl
            ? {uri: photoUrl}
            : require('../assets/images/defaultThumbnail.png')
        }
        style={{width: 120, height: 120, marginRight: 20, borderRadius: 12}}
      />
      <View className="flex-1">
        <View className="flex-row items-center gap-x-2">
          <Text
            className={
              'font-semibold ' +
              (place_name.length > 10 ? 'text-base' : 'text-xl')
            }>
            {place_name}
          </Text>
          {open && (
            <View
              className="rounded-lg px-1 py-0.5 justify-center items-center"
              style={{
                borderWidth: 1,
                borderColor: open === 'Y' ? '#338A17' : '#FF4D4D',
              }}>
              <Text
                className="text-xs"
                style={{
                  color: open === 'Y' ? '#338A17' : '#FF4D4D',
                }}>
                {open === 'Y' ? '영업중' : '영업종료'}
              </Text>
            </View>
          )}
        </View>
        <View className="flex-row items-center py-0.5">
          {scoreAvg && (
            <>
              <Text
                className="text-sm font-light text-center mr-1"
                style={{
                  color: '#F82B60',
                }}>
                {scoreAvg}
              </Text>
              <Stars scoreAvg={parseFloat(scoreAvg)} />
              {commentCnt && (
                <Text
                  className="text-sm ml-1"
                  style={{
                    color: '#7C7C7C',
                  }}>
                  {`(${commentCnt})`}
                </Text>
              )}
            </>
          )}
          {reviewCnt && (
            <Text
              className="text-sm ml-2"
              style={{
                color: '#7C7C7C',
              }}>
              {`리뷰 ${reviewCnt}`}
            </Text>
          )}
        </View>
        <Text
          className="text-sm"
          style={{
            color: '#7C7C7C',
          }}>
          {address_name}
        </Text>
        {tags && tags.length > 0 && (
          <View>
            <View className="flex-row items-center pt-2">
              {tags.map((tag: string, index: number) => {
                if (index >= 2) return null;
                return (
                  <View
                    key={index}
                    className="rounded px-1 py-0.5 mr-2"
                    style={{
                      backgroundColor: '#F2F2F2',
                    }}>
                    <Text
                      className="text-xs"
                      style={{
                        color: '#A8A8A8',
                      }}>
                      {'# ' + tag}
                    </Text>
                  </View>
                );
              })}
            </View>
            {tags.length > 2 && (
              <View className="flex-row items-center pt-2">
                {tags.map((tag: string, index: number) => {
                  if (index >= 2 && index <= 3)
                    return (
                      <View
                        key={index}
                        className="rounded px-1 py-0.5 mr-2"
                        style={{
                          backgroundColor: '#F2F2F2',
                        }}>
                        <Text
                          className="text-xs"
                          style={{
                            color: '#A8A8A8',
                          }}>
                          {'# ' + tag}
                        </Text>
                      </View>
                    );
                })}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
