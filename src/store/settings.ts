import {create} from 'zustand';

type SettingState = {
  enabledNotifications: boolean;
  locationFrequency: string;
  changeLocationFrequency: (value: string) => void;
  changeEnabledNotifications: (value: boolean) => void;
};

const useSettingStore = create<SettingState>(set => ({
  enabledNotifications: false,
  locationFrequency: '8',
  changeLocationFrequency: value => set({locationFrequency: value}),
  changeEnabledNotifications: value => set({enabledNotifications: value}),
}));

export {useSettingStore};
