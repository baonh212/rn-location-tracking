import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AppState,
  Linking,
  StyleProp,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Button, showToast} from '../../components';
import {colors, fontSize, metrics, shadow} from '../../themes';
import {useSettingStore} from '../../store/settings.ts';
import {requestNotificationPermissions} from '../../services/notifee.ts';
import {AuthorizationStatus} from '@notifee/react-native';
import {useFocusEffect} from '@react-navigation/native';

type NotificationItemProps = {
  style?: StyleProp<ViewStyle>;
  title: string;
  disabled: boolean;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  style,
  title,
  disabled,
  value,
  onValueChange,
  description,
}) => {
  return (
    <View style={StyleSheet.flatten([styles.notificationItemContainer, style])}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <Switch
          {...{
            disabled,
            value,
            onValueChange,
          }}
        />
      </View>
      {description && (
        <Text
          style={{
            marginTop: 8,
            fontSize: fontSize.small,
            color: colors.lightGray,
          }}>
          {description}
        </Text>
      )}
    </View>
  );
};

export const SettingsScreen = () => {
  const enabledNotification = useSettingStore(
    state => state.enabledNotifications,
  );
  const changeEnabledNotifications = useSettingStore(
    state => state.changeEnabledNotifications,
  );
  const locationFrequency = useSettingStore(state => state.locationFrequency);
  const changeLocationFrequency = useSettingStore(
    state => state.changeLocationFrequency,
  );

  const [allowedPushNotification, setAllowedPushNotification] =
    useState<boolean>(!enabledNotification);

  const [locationFrequencyState, setLocationFrequencyState] =
    useState<string>(locationFrequency);

  const appState = useRef(AppState.currentState);

  const handleChangeNotification = useCallback((value: boolean) => {
    changeEnabledNotifications(value);
  }, []);

  const handleChangeLocationSamplingFrequency = useCallback((text: string) => {
    setLocationFrequencyState(text);
  }, []);

  const handleSaveSettings = useCallback(() => {
    if (!locationFrequency) {
      showToast({
        type: 'ERROR',
        message: 'Please provide a location frequency',
      });
      return;
    }
    if (locationFrequencyState !== locationFrequency) {
      changeLocationFrequency(locationFrequencyState);
    }
  }, [locationFrequency, locationFrequencyState]);

  const handleTurnOnPushNotifications = useCallback(async () => {
    Linking.openSettings();
  }, []);

  const checkNotificationPermissions = useCallback(async () => {
    const permissions = await requestNotificationPermissions();
    setAllowedPushNotification(
      permissions.authorizationStatus === AuthorizationStatus.AUTHORIZED,
    );
    changeEnabledNotifications(
      permissions.authorizationStatus === AuthorizationStatus.AUTHORIZED,
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkNotificationPermissions();
    }, [checkNotificationPermissions]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkNotificationPermissions();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title}>Push notification</Text>
          {!allowedPushNotification && (
            <TouchableOpacity onPress={handleTurnOnPushNotifications}>
              <Text style={styles.text}>Turn on</Text>
            </TouchableOpacity>
          )}
        </View>
        <NotificationItem
          style={{
            marginVertical: 20,
          }}
          title={'Location Tracking'}
          disabled={!allowedPushNotification}
          value={enabledNotification}
          onValueChange={handleChangeNotification}
          description={'Message related to location tracking'}
        />
        <View style={styles.locationFrequencyContainer}>
          <Text style={styles.title}>Location Sampling Frequency</Text>
          <TextInput
            value={locationFrequencyState}
            style={styles.textInput}
            onChangeText={handleChangeLocationSamplingFrequency}
            keyboardType={'number-pad'}
          />
        </View>
      </View>
      <Button
        style={styles.button}
        title={'Save'}
        onPress={handleSaveSettings}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    textDecorationLine: 'underline',
  },
  locationFrequencyContainer: {
    marginTop: 8,
  },
  textInput: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    borderColor: 'gray',
    paddingHorizontal: 12,
  },
  button: {
    marginTop: metrics.marginTop,
    marginHorizontal: 16,
    marginBottom: metrics.span,
  },
  title: {
    fontSize: fontSize.body,
    fontWeight: 'bold',
  },
  notificationItemContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    ...shadow,
  },
});
