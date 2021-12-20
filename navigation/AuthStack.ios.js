import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import SignupScreen from '../screens/SignUp';
import LoginScreen from '../screens/Login';
import OnboardingScreen from '../screens/Onboarding';
import CollectPersonal from '../screens/CollectPersonal';


const Stack = createStackNavigator();

const AuthStack = () => {

  return (
    <Stack.Navigator initialRouteName={'Onboarding'}>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{header: () => null}}
      />
      {/* <Stack.Screen
        name="CollectPersonal"
        component={CollectPersonal}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
};

export default AuthStack;
