import React, {Component} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Login from './src/screens/Login';
import Register from './src/screens/Register';
import EmailOTP from './src/screens/EmailOTP';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import Main from './src/screens/Main';
import MovieDetails from './src/screens/MovieDetails';
import ActorDetails from './src/screens/ActorDetails';

const AppStack = createStackNavigator({
  Main: {
    screen: Main,
    navigationOptions: {
      header: null,
    },
  },
  MovieDetails: {
    screen: MovieDetails,
    navigationOptions: {
      header: null,
    },
  },
  ActorDetails: {
    screen: ActorDetails,
    // navigationOptions: {
    //   header: null,
    // },
  },
});
const AuthStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
    },
  },
  Register: {
    screen: Register,
    navigationOptions: {
      header: null,
    },
  },
  EmailOTP: {
    screen: EmailOTP,
  },
});

const SwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default createAppContainer(SwitchNavigator);
