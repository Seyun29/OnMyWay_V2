import React, {useState} from 'react';
import {TextInput, View} from 'react-native';
import {placeQuery} from '../../api/placeQuery';

export default function InputBoxEditable({
  handleSubmit,
}: {
  handleSubmit: (query: string) => void;
}) {
  //FIXME: add, update proper source of nav states (start, end , waypoints)
  //TODO: add spinner when loading the results
  //FIXME: 이전과 변화없으면 아무것도 수행 X
  const [query, setQuery] = useState<string>('');

  return (
    <View className="w-full pr-[20px]">
      <TextInput
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => handleSubmit(query)}
        placeholder="출발지 입력 (임시)"
        className={
          'w-full h-[40px] bg-[#F2F2F2] mb-[2px] px-[12px] flex-row items-center rounded-sm'
        }
        autoFocus
      />
    </View>
  );
}
