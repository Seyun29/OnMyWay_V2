import {Coordinate} from '../types/coordinate';
import {Navigation} from '../types/navigation';

export const calculateIsInBoundary = (
  nav: Navigation,
  coveringRegion: Coordinate[],
): boolean => {
  const max_lat = Math.max(...coveringRegion.map(coord => coord.latitude));
  const min_lat = Math.min(...coveringRegion.map(coord => coord.latitude));
  const max_lon = Math.max(...coveringRegion.map(coord => coord.longitude));
  const min_lon = Math.min(...coveringRegion.map(coord => coord.longitude));
  if (nav.start && nav.end) {
    if (
      nav.start.coordinate.latitude > max_lat ||
      nav.start.coordinate.latitude < min_lat ||
      nav.start.coordinate.longitude > max_lon ||
      nav.start.coordinate.longitude < min_lon
    )
      return false;
    if (
      nav.end.coordinate.latitude > max_lat ||
      nav.end.coordinate.latitude < min_lat ||
      nav.end.coordinate.longitude > max_lon ||
      nav.end.coordinate.longitude < min_lon
    )
      return false;
    for (let i = 0; i < nav.wayPoints.length; i++) {
      if (
        nav.wayPoints[i].coordinate.latitude > max_lat ||
        nav.wayPoints[i].coordinate.latitude < min_lat ||
        nav.wayPoints[i].coordinate.longitude > max_lon ||
        nav.wayPoints[i].coordinate.longitude < min_lon
      )
        return false;
    }
  }
  return true;
};
