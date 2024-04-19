import React, {memo, useCallback} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {useLocationStore, UserLocation} from '../../../store';
import {RectButton} from 'react-native-gesture-handler';
import {colors, metrics} from '../../../themes';

type AnimatedInterpolation = ReturnType<Animated.Value['interpolate']>;

type LocationItemProps = {
  item: UserLocation;
};

export const LocationItem = memo(function LocationItem({
  item,
}: LocationItemProps) {
  const deleteLocation = useLocationStore(state => state.deleteLocation);

  const renderRightActions = useCallback(
    (
      progress: AnimatedInterpolation,
      dragX: AnimatedInterpolation,
      location: UserLocation,
    ) => {
      const editTrans = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });

      const deleteTrans = dragX.interpolate({
        inputRange: [-160, 0],
        outputRange: [0, 1],
        extrapolate: 'clamp',
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
          <RectButton style={styles.swipeButton}>
            <Animated.Text
              style={[
                {
                  transform: [{translateX: editTrans}],
                },
              ]}>
              Edit
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
      <Text>{item.id}</Text>
      <Text>latitude: {item.latitude}</Text>
      <Text>longitude: {item.longitude}</Text>
      <Text>accuracy: {item.accuracy}</Text>
      <Text>altitudeAccuracy: {item.altitudeAccuracy}</Text>
      <Text>speed: {item.speed}</Text>
      <Text>heading: {item.heading}</Text>
      <Text>altitude: {item.altitude}</Text>
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
