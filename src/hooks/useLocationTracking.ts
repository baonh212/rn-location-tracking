import {useCallback, useEffect} from 'react';
import * as Location from 'expo-location';
import {LocationObject} from 'expo-location';
import {showToast} from '../components';
import {cosineDistanceBetweenPoints} from '../screens/Location/utils.ts';
import * as Crypto from 'expo-crypto';
import {useLocationStore} from '../store';
import * as TaskManager from 'expo-task-manager';
import {TaskManagerError} from 'expo-task-manager';
import {useSettingStore} from '../store/settings.ts';
import {displayNotification} from '../services/notifee.ts';

let lastTimestamp: number | null = null;
let accumulatedTime: number = 0;
let notMovingTimeout: NodeJS.Timeout;

export const UPDATE_LOCATION_TASK = 'UPDATE_LOCATION_TASK';
const NOT_MOVING_TIME = 10 * 60 * 1000; //10 minutes
const NOT_MOVING_DISTANCE = 10; // 10 meters

type TaskLocationResponse = {
  data: {
    locations: LocationObject[];
  };
  error: TaskManagerError | null;
};

// 🚀 Define the task to handle location updates.
TaskManager.defineTask(
  UPDATE_LOCATION_TASK,
  ({data, error}: TaskLocationResponse) => {
    if (error) {
      // 🔴 Log errors if any occur while fetching location data.
      console.error(`Error fetching location: ${error.message}`);
      return;
    }
    if (data) {
      const {locations} = data;
      const {timestamp} = locations[0];
      const locationFrequency = useSettingStore.getState().locationFrequency;
      const enabledNotifications =
        useSettingStore.getState().enabledNotifications;
      const addLocation = useLocationStore.getState().addLocation;
      const locationLastIndex = useLocationStore.getState().locationLastIndex;
      const locationsState = useLocationStore.getState().locations;
      if (lastTimestamp !== null) {
        // ⏰ Calculate the time difference between current and last timestamp.
        const timeDifference = (timestamp - lastTimestamp) / 1000;
        accumulatedTime += timeDifference;
        // console.log({
        //   timeDifference: timeDifference.toFixed(1),
        //   accumulatedTime: accumulatedTime.toFixed(1),
        // });

        // 📈 Check if accumulated time has reached or exceeded 60 seconds.
        if (accumulatedTime >= +locationFrequency) {
          const {latitude: prevLat, longitude: prevLong} =
            locationsState[locationLastIndex];
          const {latitude: nextLat, longitude: nextLong} = locations[0].coords;
          const distance = cosineDistanceBetweenPoints(
            prevLat,
            prevLong,
            nextLat,
            nextLong,
          );
          // if (distance <= NOT_MOVING_DISTANCE) {
          // }
          // Here, we'd trigger the logic to send data to the server.
          addLocation({
            ...locations[0].coords,
            timestamp: locations[0].timestamp,
            id: Crypto.randomUUID(),
          });
          if (distance <= NOT_MOVING_DISTANCE) {
            clearTimeout(notMovingTimeout); // Reset the timer
            if (enabledNotifications) {
              notMovingTimeout = setTimeout(async () => {
                await displayNotification(
                  `You aren't moving`,
                  'Tap here to stop tracking location',
                );
              }, NOT_MOVING_TIME);
            }
          }
          // 🔧 Adjust the accumulated time for any excess beyond 60 seconds.
          accumulatedTime -= +locationFrequency;
        }
      }
      // 🔄 Update last timestamp for the next comparison.
      lastTimestamp = timestamp;
    }
  },
);

export const useLocationTracking = () => {
  const addLocation = useLocationStore(state => state.addLocation);
  const enabledNotifications = useSettingStore.getState().enabledNotifications;

  const startLocationUpdate = useCallback(async () => {
    const {status: foregroundStatus} =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      const {status: backgroundStatus} =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === 'granted') {
        await Location.startLocationUpdatesAsync(UPDATE_LOCATION_TASK, {
          accuracy: Location.Accuracy.Highest,
          showsBackgroundLocationIndicator: true,
          timeInterval: 15000,
        });
      }
    }
  }, []);

  const fetchAndAddLocation = useCallback(async () => {
    let location = await Location.getCurrentPositionAsync({});
    addLocation({
      ...location.coords,
      timestamp: location.timestamp,
      id: Crypto.randomUUID(),
    });
  }, []);

  const getLocationAndStartTracking = useCallback(async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      showToast({
        type: 'ERROR',
        message: 'Permission to access location was denied',
      });
      return;
    }
    await fetchAndAddLocation();
    if (enabledNotifications) {
      notMovingTimeout = setTimeout(async () => {
        await displayNotification(
          `You aren't moving`,
          'Tap here to stop tracking location',
        );
      }, NOT_MOVING_TIME);
    }
    startLocationUpdate().then();
  }, []);

  useEffect(() => {
    getLocationAndStartTracking().then();
  }, []);

  return {
    startLocationUpdate,
  };
};
