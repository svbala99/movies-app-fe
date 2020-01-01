import React, {Component} from 'react';
import {Text, ImageBackground, StyleSheet, Image, View} from 'react-native';
import {Button, ActivityIndicator} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import Topbar from '../components/Topbar';

import {PRIMARY_COLOR} from '../Constants/Colors';
class Search extends Component {
  state = {
    isLoggingOut: false,
  };
  onPressLogout = async () => {
    // await AsyncStorage.removeItem('ACCESS_TOKEN');
    await AsyncStorage.clear();
    this.setState({isLoggingOut: true});
    setTimeout(() => {
      this.setState({isLoggingOut: false});
      this.props.navigation.navigate('Auth');
      // this.props.navigation.pop();
    }, 1000);
  };

  renderSearchPage = () => {
    return (
      <View style={styles.container}>
        <Topbar />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <Text>Home Screen</Text>
          <Button
            icon="logout"
            color={PRIMARY_COLOR}
            mode={'contained'}
            onPress={this.onPressLogout}>
            Logout
          </Button>
        </View>
      </View>
    );
  };

  renderLoader = () => {
    return (
      <ImageBackground
        source={require('../assets/splashScreen.jpg')}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        <Image
          source={require('../assets/main-icon.png')}
          style={styles.icon}
        />
        <Text style={styles.spacing}>Logging Out...</Text>
        <ActivityIndicator
          animating={true}
          size={'large'}
          color={PRIMARY_COLOR}
        />
      </ImageBackground>
    );
  };
  render() {
    const {isLoggingOut} = this.state;

    return (
      <View style={styles.container}>
        {isLoggingOut ? this.renderLoader() : this.renderSearchPage()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e5e5e5',
    flex: 1,
    justifyContent: 'center',
  },
  spacing: {
    marginBottom: 20,
    fontSize: 16,
    paddingHorizontal: 50,
  },
  icon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
});

export default Search;
