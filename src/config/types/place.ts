import {Coordinate} from './coordinate';

export interface recentPlaceDetail {
  placeName: string;
  coordinate: Coordinate;
}

export interface favoritePlaceDetail extends recentPlaceDetail {}

export interface recentPlace {
  places: recentPlaceDetail[];
}

export interface favoritePlace {
  places: favoritePlaceDetail[];
}
