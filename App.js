/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';

import ToastModule from './Toast';
import Alert from './Alert';
import {getBrightness, setBrightness} from './Brightness';

const App: () => Node = () => {
  const [value, setValue] = useState(-1);

  const onPress = async () => {
    /*IOS*/
    // Alert.alert('Hello DongJu');
    // console.log({
    //   string: Alert.STRING_VALUE,
    //   number: Alert.NUMBER_VALUE,
    // });

    /*Android*/
    // ToastModule.show('Hello DongJu', ToastModule.SHORT);

    const brightness = await getBrightness();
    setValue(brightness);
  };

  const onPressLow = () => {
    setBrightness(0.25);
  };

  const onPressHigh = () => {
    setBrightness(1);
  };

  return (
    <SafeAreaView style={styles.block}>
      <Button title="Update Brightness" onPress={onPress} />
      <View style={styles.textWrapper}>
        <Text style={styles.text}>{value}</Text>
      </View>
      <Button title="Low Brightness" onPress={onPressLow} />
      <Button title="High Brightness" onPress={onPressHigh} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  textWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    fontSize: 64,
  },
});

export default App;
