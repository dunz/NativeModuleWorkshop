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

const App: () => Node = () => {
  const onPress = () => {
    ToastModule.show('Hello World', ToastModule.SHORT);
  };

  return (
    <SafeAreaView>
      <Button title="Press me" onPress={onPress} />
    </SafeAreaView>
  );
};

export default App;
