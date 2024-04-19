import notifee from '@notifee/react-native';

let notifeeChannelId: string;

const requestNotificationPermissions = async () => {
  // Request permissions (required for iOS)
  return await notifee.requestPermission();
};

const createAndroidNotificationChannel = async () => {
  notifeeChannelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
};

const displayNotification = async (title: string, body: string) => {
  return await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId: notifeeChannelId,
    },
  });
};

export {
  requestNotificationPermissions,
  notifeeChannelId,
  displayNotification,
  createAndroidNotificationChannel,
};
