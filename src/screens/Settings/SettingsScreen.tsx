import React, {useCallback, useState} from 'react';
import {StyleSheet, Switch, Text, TextInput, View} from 'react-native';
import {Button, showToast} from '../../components';
import {metrics} from '../../themes';

export const SettingsScreen = () => {
  const [enabledNotification, setEnabledNotification] =
    useState<boolean>(false);
  const [locationFrequency, seLocationFrequency] = useState<string>('8');

  const handleChangeNotification = useCallback((value: boolean) => {
    setEnabledNotification(value);
  }, []);

  const handleChangeLocationSamplingFrequency = useCallback((text: string) => {
    seLocationFrequency(text);
  }, []);

  const handleSaveSettings = useCallback(() => {
    if (!locationFrequency) {
      showToast({
        type: 'ERROR',
        message: 'Please provide a location frequency',
      });
      return;
    }
    //Save to local storage
  }, [locationFrequency]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.text}>Push notification</Text>
          <Switch
            value={enabledNotification}
            onValueChange={handleChangeNotification}
          />
        </View>
        <View style={styles.locationFrequencyContainer}>
          <Text style={styles.text}>Location Sampling Frequency</Text>
          <TextInput
            value={locationFrequency}
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
    backgroundColor: 'white',
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
  text: {},
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
});
