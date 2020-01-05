import React, {Component} from 'react';
import {Text, View} from 'react-native';
class Favorites extends Component {
  constructor(props) {
    super(props);
    console.log('from constructor');
  }
  componentWillMount = () => {
    console.log('from Will mount');
  };
  componentDidMount = () => {
    console.log('from did mount');
  };

  render() {
    console.log('from render');
    console.table();
    return (
      <View>
        <Text>{'From Favorites'}</Text>
      </View>
    );
  }
  componentWillUnmount = () => {
    console.log('====================================');
    console.log('from will unmount');
    console.log('====================================');
  };
}

export default Favorites;
