import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import * as Location from 'expo-location';
import {useLocationStore, UserLocation} from '../../store';
import * as Crypto from 'expo-crypto';
import {getCurrentPosition} from './utils.ts';
import {LocationItem} from './components/LocationItem.tsx';
import {showToast} from '../../components';

export const LocationScreen = () => {
  const flatListRef = useRef<FlatList>(null);

  const locations = useLocationStore(state => state.locations);
  const addLocation = useLocationStore(state => state.addLocation);

  const fetchAndAddLocation = async () => {
    let location = await getCurrentPosition();
    addLocation({
      ...location.coords,
      timestamp: location.timestamp,
      id: Crypto.randomUUID(),
    });
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const getLocation = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast({
          type: 'ERROR',
          message: 'Permission to access location was denied',
        });
        return;
      }
      await fetchAndAddLocation();

      intervalId = setInterval(fetchAndAddLocation, 8000); // Collect location every 8 seconds
    };

    getLocation().then();

    return () => {
      if (intervalId) clearInterval(intervalId); // Clear interval on unmount
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom when the data changes
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [locations]); // Trigger the effect whenever the data changes

  const renderItem = useCallback(({item}: {item: UserLocation}) => {
    return <LocationItem item={item} />;
  }, []);

  return (
    <View style={styles.container}>
      <FlatList<UserLocation>
        ref={flatListRef}
        data={locations}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.white,
  },
  actionButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
