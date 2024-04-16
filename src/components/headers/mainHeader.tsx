import {TextInput, View} from 'react-native';
import MenuIconSVG from '../../assets/images/menuIcon.svg';
import AddStopOverSVG from '../../assets/images/addStopOver.svg';
import ChangeDirectionSVG from '../../assets/images/changeDirection.svg';
export default function MainHeader() {
  return (
    <View
      style={{
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      }}
      className="bg-white w-full justify-start items-start px-[16px] pt-[16px] pb-[13px] gap-y-[13px]">
      <MenuIconSVG height={'24px'} width={'24px'} />
      <View className="relative flex-row items-center justify-between w-full">
        <View className="flex-col w-full">
          <View className="absolute z-10 right-[10px] top-0 transform translate-y-[29px] bg-white h-[26px] w-[26px] rounded-[100px] shadow-md items-center justify-center">
            <AddStopOverSVG height={'18px'} width={'18px'} />
          </View>
          <TextInput className="h-[40px] bg-[#F2F2F2] mb-[2px]"></TextInput>
          <TextInput className="h-[40px] bg-[#F2F2F2]"></TextInput>
        </View>
        <ChangeDirectionSVG height={'24px'} width={'24px'} />
      </View>
    </View>
  );
}
