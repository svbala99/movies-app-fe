import React, {Component} from 'react';
import {ImageBackground, Text, StyleSheet, Image, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import * as COLORS from '../Constants/Colors';
import LinearGradient from 'react-native-linear-gradient';

import AsyncStorage from '@react-native-community/async-storage';

class AuthLoadingScreen extends Component {
  componentDidMount = () => {
    this.signInChecker();
  };
  signInChecker = async () => {
    const ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    setTimeout(() => {
      this.props.navigation.navigate(ACCESS_TOKEN ? 'App' : 'Auth');
    }, 2000);
  };
  render() {
    return (
      <LinearGradient
        colors={[COLORS.SECONDARY_VARIANT, COLORS.SURFACE]}
        style={styles.loaderBG}>
        <Image
          source={require('../assets/main-icon.png')}
          style={styles.icon}
        />
        <Text
          style={{
            color: COLORS.ON_BACKGROUND,
            fontSize: 18,
            fontWeight: '800',
            paddingVertical: 50,
          }}>
          Welcome to Movies App...
        </Text>
        <ActivityIndicator
          animating={true}
          size="large"
          color={COLORS.PRIMARY_VARIANT}
        />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  loaderBG: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
});

export default AuthLoadingScreen;
