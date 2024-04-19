import {ParamListBase} from '@react-navigation/native';
import {RouteKey} from './RouteKey.ts';
import {UserLocation} from '../store';

/** Type */

type LocationDetailsScreenParams = {
  location: UserLocation;
};

export interface AppStackParamList extends ParamListBase {
  /** Params */
  [RouteKey.Location]: object;
  [RouteKey.LocationDetails]: LocationDetailsScreenParams;
}
