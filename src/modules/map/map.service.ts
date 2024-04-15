import { HttpException, Injectable } from '@nestjs/common';
import {
  GetAddressRequestDto,
  GetDrivingRouteRequestDto,
  GetKeywordSearchRequestDto,
  GetStopByDurationRequestDto,
} from './dto/map.request.dto';
import kakaoGetAddress from 'src/apis/kakaoGetAddress';
import kakaoKeywordSearch from 'src/apis/kakaoKeywordSearch';
import kakaoGetDrivingRoute from 'src/apis/kakaoGetDrivingRoute';
import { GetDrivingRouteQuery } from 'src/apis/types/omwApiTypes';
import { GetDrivingRouteResponseDto } from './dto/map.response.dto';
import { ROUTE_PRIORITY_LIST } from 'src/config/consts';

@Injectable()
export class MapService {
  async getAddress(params: GetAddressRequestDto) {
    const res = await kakaoGetAddress(params);
    if (res) {
      const data = res.documents.map((doc) => ({
        road_address: doc.road_address.address_name,
        address: doc.address.address_name,
      }));
      return data;
    }
    return res;
  }

  async getKeywordSearch(params: GetKeywordSearchRequestDto) {
    const data = await kakaoKeywordSearch(params);
    //FIXME: add more logics here, fine tune parameters (accuracy, priority, etc.)
    return data?.documents;
  }

  async getDrivingRoute(params: GetDrivingRouteRequestDto) {
    const promises = ROUTE_PRIORITY_LIST.map(async (priority) => {
      //FIXME: fix me -> Request Dto has been changed!
      //FIXME: have to return where origin, destination, waypoints are in the original route search API
      const data = await kakaoGetDrivingRoute(params);
      if (data.routes[0].result_code !== 0) {
        throw new HttpException(data.routes[0].result_msg, 400);
      }

      const route = data.routes[0];
      const duration = route.summary.duration;
      const distance = route.summary.distance;

      const tmpPath = [];
      route.sections.forEach((section) => {
        const roads = section.roads;
        roads.forEach((road) => {
          tmpPath.push(...road.vertexes);
        });
      });

      const path = tmpPath.reduce((acc, cur, idx) => {
        if (idx % 2 === 0) acc.push([cur]);
        else acc[acc.length - 1].push(cur);
        return acc;
      }, []);

      return { priority, duration, distance, path };
    });

    const results = await Promise.allSettled(promises);
    const successfulResults = results.filter(
      (result) => result.status === 'fulfilled',
    );

    const res = successfulResults.map(
      (result: PromiseFulfilledResult<any>) => result.value,
    );

    return res;
  }

  async getStopByDuration(params: GetStopByDurationRequestDto) {
    const { stopby, waypoints, ...rest } = params;
    const waypointsList = [];
    if (waypoints) {
      const oldList = waypoints.split(' | ');
      if (oldList.length == 2) {
        waypointsList.push(`${stopby} | ${oldList[0]} | ${oldList[1]}`);
        waypointsList.push(`${oldList[0]} | ${stopby} | ${oldList[1]}`);
        waypointsList.push(`${oldList[0]} | ${oldList[1]} | ${stopby}`);
      } else if (oldList.length == 1) {
        waypointsList.push(`${stopby} | ${waypoints}`);
        waypointsList.push(`${waypoints} | ${stopby}`);
      }
    } else waypointsList.push(stopby);

    const promise = waypointsList.map(async (waypoint) => {
      console.log({
        ...rest,
        waypoints: waypoint,
        summary: true,
        alternatives: false,
      });
      const data = await kakaoGetDrivingRoute({
        ...rest,
        waypoints: waypoint,
        summary: true,
        alternatives: false,
      });
      // if (data.routes[0].result_code !== 0) {
      //   throw new HttpException(data.routes[0].result_msg, 400);
      // }
      return data.routes[0].summary.duration;
    });
    //request multiple route search API for each waypoint, returns the shortest one (tells the order of waypoints)
    const results = await Promise.allSettled(promise);
    const successfulResults = results.filter(
      (result) => result.status === 'fulfilled',
    );
    if (successfulResults.length === 0)
      throw new HttpException('Error: No route found', 400);
    const candidates = successfulResults.map(
      (result: PromiseFulfilledResult<any>) => result.value,
    );
    const res = { duration: Math.min(...candidates) };
    return res;
  }
}
