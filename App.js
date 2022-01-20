/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {Button, SafeAreaView} from 'react-native';

import ToastModule from './Toast';
import Alert from './Alert';

const App: () => Node = () => {
  const onPress = () => {
    Alert.alert('Hello DongJu');
    console.log({
      string: Alert.STRING_VALUE,
      number: Alert.NUMBER_VALUE,
    });
    // ToastModule.show('Hello DongJu', ToastModule.SHORT);
  };

  return (
    <SafeAreaView>
      <Button title="Press me" onPress={onPress} />
    </SafeAreaView>
  );
};

export default App;
