import {NMAP_URL_SCHEME_PREFIX, NMAP_URL_SCHEME_SUFFIX} from '../consts/link';
import {NavDetail} from '../types/navigation';
import {PlaceDetail} from '../types/coordinate';

type StopByStrategy = 'FRONT' | 'MIDDLE' | 'REAR' | undefined;

const encodeName = (name: string) => encodeURIComponent(name);

export const createURLScheme = (
  start: NavDetail,
  end: NavDetail,
  wayPoints: NavDetail[],
  curPlace: PlaceDetail,
  stopByStrategy: StopByStrategy,
): string => {
  const stopBy: NavDetail = {
    name: curPlace.place_name,
    coordinate: curPlace.coordinate,
  };

  let orderedStops: NavDetail[];
  if (wayPoints.length === 0) {
    orderedStops = [stopBy];
  } else if (wayPoints.length === 1) {
    orderedStops =
      stopByStrategy === 'REAR'
        ? [wayPoints[0], stopBy]
        : [stopBy, wayPoints[0]];
  } else if (stopByStrategy === 'FRONT') {
    orderedStops = [stopBy, ...wayPoints.slice(0, 2)];
  } else if (stopByStrategy === 'MIDDLE') {
    orderedStops = [wayPoints[0], stopBy, wayPoints[1]];
  } else {
    orderedStops = [...wayPoints.slice(0, 2), stopBy];
  }

  const startParams = `slat=${start.coordinate.latitude}&slng=${start.coordinate.longitude}&sname=${encodeName(start.name)}`;
  const waypointParams = orderedStops
    .map(
      (waypoint, index) =>
        `v${index + 1}lat=${waypoint.coordinate.latitude}&v${index + 1}lng=${waypoint.coordinate.longitude}&v${index + 1}name=${encodeName(waypoint.name)}`,
    )
    .join('&');
  const endParams = `dlat=${end.coordinate.latitude}&dlng=${end.coordinate.longitude}&dname=${encodeName(end.name)}`;

  return `${NMAP_URL_SCHEME_PREFIX}${startParams}&${waypointParams}&${endParams}${NMAP_URL_SCHEME_SUFFIX}`;
};
