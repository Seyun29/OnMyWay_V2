import {SERVER_BASEURL} from '@env';

export const BASE_URL = SERVER_BASEURL;
export const COORD_TO_ADDRESS = '/map/get-address';
export const PLACE_QUERY = '/map/keyword-search';
export const GET_ROUTES = '/map/driving-route';
export const SEARCH_ON_PATH = '/map/search-on-path';
export const GET_STOPBY_DURATION = '/map/stopby-duration';

export const LOCAL_LLM_URL = '10.16.135.41'; //FIXME: change this to the local llm server url
export const LLM_MODEL_NAME = 'gemma';
export const GET_REVIEW_SUMMARY = '/map/get-review-summary';
