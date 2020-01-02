import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
class Loader extends Component {
  render() {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
        }}>
        <Text>Loading...</Text>
        <ActivityIndicator size={'large'} color={COLORS.PRIMARY} />
      </View>
    );
  }
}

export default Loader;
