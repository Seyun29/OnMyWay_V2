import {atom} from 'recoil';

export const modalState = atom<boolean>({
  key: 'modalState', // unique ID (with respect to other atoms/selectors)
  default: false, // 자료형 따라 초기값을 다르게 설정해주자
});
