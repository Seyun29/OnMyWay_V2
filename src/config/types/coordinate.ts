export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface CoordDetail extends Coordinate {
  //FIXME: add other properties here
  open?: boolean;
  category?: string; //FIXME: add enum for category
}

export interface OmWMarkerProps {
  //TODO: add more props here
  coordList: CoordDetail[];
}
