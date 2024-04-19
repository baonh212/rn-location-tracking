import React, {useCallback, useEffect, useRef} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import * as Location from 'expo-location';
import {useLocationStore, UserLocation} from '../../store';
import {LocationItem} from './components/LocationItem.tsx';
import * as TaskManager from 'expo-task-manager';
import notifee, {AuthorizationStatus, EventType} from '@notifee/react-native';
import {UPDATE_LOCATION_TASK, useLocationTracking} from '../../hooks';
import {requestNotificationPermissions} from '../../services/notifee.ts';
import {useSettingStore} from '../../store/settings.ts';
import {colors} from '../../themes';
import {RouteKey} from '../../navigation/RouteKey.ts';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigation/types.ts';

notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.PRESS) {
    await Location.stopLocationUpdatesAsync(UPDATE_LOCATION_TASK);
    console.log('Background location stopped');
    const isTaskDefined = TaskManager.isTaskDefined(UPDATE_LOCATION_TASK);
    if (isTaskDefined) {
      await TaskManager.unregisterTaskAsync(UPDATE_LOCATION_TASK);
    }
    console.log('All tasks unregistered');
  }
});

type LocationScreenProps = StackScreenProps<
  AppStackParamList,
  RouteKey.Location
>;

export const LocationScreen: React.FC<LocationScreenProps> = ({navigation}) => {
  const flatListRef = useRef<FlatList>(null);

  const locations = useLocationStore(state => state.locations);
  const changeEnabledNotifications = useSettingStore(
    state => state.changeEnabledNotifications,
  );

  useLocationTracking();

  const handleOnLocationPress = useCallback((location: UserLocation) => {
    navigation.navigate(RouteKey.LocationDetails, {
      location,
    });
  }, []);

  useEffect(() => {
    requestNotificationPermissions().then(permissions => {
      if (permissions.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
        changeEnabledNotifications(true);
      }
    });
    return notifee.onForegroundEvent(async ({type, detail}) => {
      switch (type) {
        case EventType.PRESS:
          await Location.stopLocationUpdatesAsync(UPDATE_LOCATION_TASK);
          console.log('Background location stopped');
          await TaskManager.unregisterAllTasksAsync();
          console.log('All tasks unregistered');
          break;
        default:
          break;
      }
    });
  }, []);

  useEffect(() => {
    // Scroll to the bottom when the data changes
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [locations]); // Trigger the effect whenever the data changes

  const renderItem = useCallback(({item}: {item: UserLocation}) => {
    return <LocationItem onLocationPress={handleOnLocationPress} item={item} />;
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
    backgroundColor: colors.background,
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
