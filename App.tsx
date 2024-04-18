import React from 'react';
import {MainNavigator} from './src/navigation/MainNavigator.tsx';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Toast} from './src/components';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <MainNavigator />
      <Toast />
    </SafeAreaProvider>
  );
}

export default App;
