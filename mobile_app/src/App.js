import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ResultScreen from './screens/ResultScreen';
import XaiScreen from './screens/XaiScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {backgroundColor: '#0f172a'},
          headerTintColor: '#f8fafc',
          contentStyle: {backgroundColor: '#f1f5f9'},
        }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Nail AI Detector'}} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Explainability" component={XaiScreen} options={{title: 'AI Explanation'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
