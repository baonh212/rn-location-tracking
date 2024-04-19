import {create} from 'zustand';
import {LocationObjectCoords} from 'expo-location/src/Location.types.ts';

type UserLocation = {
  id: string;
  timestamp: number;
} & LocationObjectCoords;

type LocationsState = {
  locations: UserLocation[];
  addLocation: (location: UserLocation) => void;
  updateLocation: (id: string, userLocation: UserLocation) => void;
  deleteLocation: (id: string) => void;
  locationLastIndex: number;
};

const useLocationStore = create<LocationsState>(set => ({
  locations: [],
  locationLastIndex: 0,
  addLocation: location =>
    set(state => ({
      locationLastIndex: state.locations.length,
      locations: state.locations.concat({...location}),
    })),
  deleteLocation: id =>
    set(state => ({locations: state.locations.filter(l => l.id !== id)})),
  updateLocation: (id, userLocation) =>
    set(state => {
      const lookupIndex = state.locations.findIndex(l => l.id === id);
      const nextLocations = JSON.parse(JSON.stringify(state.locations));
      nextLocations[lookupIndex] = userLocation;
      return {
        locations: nextLocations,
      };
    }),
}));

export {useLocationStore};
export type {UserLocation};
