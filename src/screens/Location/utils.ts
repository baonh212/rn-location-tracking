import * as Location from 'expo-location';

export const getCurrentPosition = async () => {
  return await Location.getCurrentPositionAsync({});
};
