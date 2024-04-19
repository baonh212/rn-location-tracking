import React, {memo, useCallback} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {useLocationStore, UserLocation} from '../../../store';
import {RectButton} from 'react-native-gesture-handler';
import {colors, metrics} from '../../../themes';

type AnimatedInterpolation = ReturnType<Animated.Value['interpolate']>;

type LocationItemProps = {
  item: UserLocation;
  onLocationPress: (item: UserLocation) => void;
};

export const LocationItem = memo(function LocationItem({
  item,
  onLocationPress,
}: LocationItemProps) {
  const deleteLocation = useLocationStore(state => state.deleteLocation);

  const renderRightActions = useCallback(
    (
      progress: AnimatedInterpolation,
      dragX: AnimatedInterpolation,
      location: UserLocation,
    ) => {
      const deleteTrans = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [0, 1],
      });
      return (
        <>
          <RectButton
            style={styles.swipeButton}
            onPress={() => {
              deleteLocation(location.id);
            }}>
            <Animated.Text
              style={[
                {
                  transform: [{translateX: deleteTrans}],
                },
              ]}>
              Delete
            </Animated.Text>
          </RectButton>
        </>
      );
    },
    [],
  );

  return (
    <Swipeable
      childrenContainerStyle={{}}
      containerStyle={styles.container}
      renderRightActions={(progressAnimatedValue, dragAnimatedValue) => {
        return renderRightActions(
          progressAnimatedValue,
          dragAnimatedValue,
          item,
        );
      }}>
      <TouchableOpacity
        onPress={() => {
          onLocationPress(item);
        }}>
        <Text>{item.id}</Text>
        <Text>latitude: {item.latitude}</Text>
        <Text>longitude: {item.longitude}</Text>
        <Text>accuracy: {item.accuracy}</Text>
        <Text>altitudeAccuracy: {item.altitudeAccuracy}</Text>
        <Text>speed: {item.speed}</Text>
        <Text>heading: {item.heading}</Text>
        <Text>altitude: {item.altitude}</Text>
      </TouchableOpacity>
    </Swipeable>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  swipeButton: {
    backgroundColor: colors.red,
    paddingHorizontal: metrics.xs,
    justifyContent: 'center',
  },
});
