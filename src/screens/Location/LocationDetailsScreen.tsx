import React, {useCallback, useState} from 'react';
import {
  Linking,
  Platform,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Button} from '../../components';
import {colors, isIOS} from '../../themes';
import {AppStackParamList} from '../../navigation/types.ts';
import {RouteKey} from '../../navigation/RouteKey.ts';
import {StackScreenProps} from '@react-navigation/stack';
import {useLocationStore} from '../../store';

type LocationDetailsScreenProps = StackScreenProps<
  AppStackParamList,
  RouteKey.LocationDetails
>;

export const LocationDetailsScreen: React.FC<LocationDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const updateLocation = useLocationStore(state => state.updateLocation);
  const {location} = route.params;

  const [latitude, setLatitude] = useState<string>(
    location.latitude.toString(),
  );
  const [longitude, setLongitude] = useState<string>(
    location.longitude.toString(),
  );

  const handleUpdateLocation = useCallback(() => {
    updateLocation(location.id, {
      ...location,
      latitude: +latitude,
      longitude: +longitude,
    });
    navigation.goBack();
  }, [latitude, longitude]);

  const handleOpenAppleMaps = useCallback(() => {
    const url = 'maps:' + location.latitude + ',' + location.longitude;
    Linking.canOpenURL(url);
  }, []);

  const handleOpenGoogleMaps = useCallback(() => {
    const url = Platform.select({
      ios: 'geo:' + location.latitude + ',' + location.longitude,
      android: 'geo:' + location.latitude + ',' + location.longitude,
    }) as string;

    Linking.canOpenURL(url);
  }, []);

  const handleShareLocation = useCallback(async () => {
    const message = Platform.select({
      ios: `https://maps.apple.com/?ll=${location.latitude},${location.longitude}`,
      android: `https://www.google.com/maps/search/?api=1&query=${location?.latitude},${location?.longitude}`,
    }) as string;
    const shareResponse = await Share.share({
      title: 'User Location',
      message: message,
    });
    //TODO: Update callback from shareResponse
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>{location.id}</Text>
        <Text>latitude:</Text>
        <TextInput
          defaultValue={latitude}
          onChangeText={text => {
            setLatitude(text);
          }}
        />
        <Text>longitude:</Text>
        <TextInput
          defaultValue={longitude}
          onChangeText={text => {
            setLongitude(text);
          }}
        />
        <Text>accuracy: {location.accuracy}</Text>
        <Text>altitudeAccuracy: {location.altitudeAccuracy}</Text>
        <Text>speed: {location.speed}</Text>
        <Text>heading: {location.heading}</Text>
        <Text>altitude: {location.altitude}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={{
            marginTop: 20,
          }}
          title={'Update Location'}
          onPress={handleUpdateLocation}
        />
        {isIOS && (
          <Button title={'Open Apple Maps'} onPress={handleOpenAppleMaps} />
        )}
        <Button
          style={{
            marginVertical: 20,
          }}
          title={'Open Google Maps'}
          onPress={handleOpenGoogleMaps}
        />
        <Button title={'Share Location'} onPress={handleShareLocation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
});
