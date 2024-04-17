import {atom} from 'recoil';
import {ANAM} from '../dummy/coord';
import {Coordinate} from '../config/types/coordinate';

export const curPositionState = atom<Coordinate>({
  key: 'curPositionState',
  default: ANAM,
});
