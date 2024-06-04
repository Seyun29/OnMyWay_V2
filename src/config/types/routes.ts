import {Coordinate} from './coordinate';

export type Priority = 'RECOMMEND' | 'TIME' | 'DISTANCE';

export interface RouteDetail {
  priority: Priority;
  duration: number;
  distance: number;
  path: Coordinate[];
}

export type Routes = RouteDetail[];
