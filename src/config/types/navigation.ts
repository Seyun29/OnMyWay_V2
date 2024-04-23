import {Coordinate} from './coordinate';

type NavDetail = {
  name: string;
  coordinate: Coordinate;
};

export interface Navigation {
  start: NavDetail | null;
  wayPoints: NavDetail[];
  end: NavDetail | null;
}
