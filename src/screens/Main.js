import React, {Component} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {BottomNavigation} from 'react-native-paper';
import * as COLORS from '../Constants/Colors';
import Home from './Home';
import Trending from './Trending';
import Search from './Search';

class Main extends Component {
  state = {
    index: 0,
    routes: [
      {
        key: 'home',
        title: 'Home',
        icon: 'home',
      },
      {
        key: 'trending',
        title: 'Trending',
        icon: 'trending-up',
      },
      {
        key: 'search',
        title: 'Search',
        icon: 'magnify',
      },
    ],
  };
  _handleIndexChange = index => this.setState({index});

  _renderScene = ({route, jumpTo}) => {
    const {navigation} = this.props;
    switch (route.key) {
      case 'home': {
        return <Home navigation={navigation} />;
      }
      case 'trending': {
        return <Trending navigation={navigation} />;
      }
      case 'search': {
        return <Search navigation={navigation} />;
      }
      default: {
        return null;
      }
    }
  };

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
        barStyle={styles.bottomBar}
      />
    );
  }
}

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: COLORS.PRIMARY,
    color: 'white',
  },
});
export default Main;
