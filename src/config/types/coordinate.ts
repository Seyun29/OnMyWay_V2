export interface Coordinate {
  latitude: number; //y
  longitude: number; //x
}

export interface CoordDetail extends Coordinate {
  //FIXME: add other properties here
  isOpen?: boolean;
  isClosed?: boolean; //else, if will be 'default' marker
  category?: string; //FIXME: add enum for category
}

export interface OmWMarkerProps {
  //TODO: add more props here
  coordList: CoordDetail[];
}

export interface Center extends Coordinate {
  zoom: number;
}
