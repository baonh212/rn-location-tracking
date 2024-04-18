import React, {useCallback} from 'react';
import {Animated, FlatList, StyleSheet, Text, View} from 'react-native';
import {colors, metrics} from '../../themes';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from 'react-native-gesture-handler';

export const LocationScreen = () => {
  const abc = [1, 2, 3, 4];

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const trans2 = dragX.interpolate({
      inputRange: [-160, 0],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <>
        <RectButton
          style={{
            backgroundColor: colors.red,
            paddingHorizontal: metrics.xs,
            justifyContent: 'center',
          }}
          onPress={() => {}}>
          <Animated.Text
            style={[
              {
                transform: [{translateX: trans2}],
              },
            ]}>
            Delete
          </Animated.Text>
        </RectButton>
        <RectButton
          style={{
            backgroundColor: 'gray',
            justifyContent: 'center',
            paddingHorizontal: metrics.xs,
          }}>
          <Text>Edit</Text>
        </RectButton>
      </>
    );
  };

  const renderItem = useCallback(({item}) => {
    return (
      <Swipeable
        childrenContainerStyle={{
          backgroundColor: 'blue',
          height: 50,
        }}
        containerStyle={{
          marginBottom: 20,
        }}
        renderRightActions={renderRightActions}>
        <Text>{item}</Text>
      </Swipeable>
    );
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={abc}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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
