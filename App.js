import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, TextInput} from 'react-native';
//import * as Font from 'expo-font';
//import { AppLoading } from 'expo';
import Navigator from './routes/HomeStack';

export default function App(){

  return (
    <Navigator/>
  );
}