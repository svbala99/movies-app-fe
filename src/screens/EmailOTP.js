import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {ActivityIndicator, TextInput, Button} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import {PRIMARY_COLOR, BACKGROUND} from '../Constants/Colors';
import Axios from 'axios';
import {activateUrl} from '../Constants/Url';
import {createStackNavigator} from 'react-navigation-stack';

class EmailOTP extends Component {
  state = {
    otp: '',
    isLoading: false,
  };
  renderLoader = () => {
    return (
      <View>
        <Text>Creating Account ...</Text>
        <ActivityIndicator
          size={'large'}
          color={PRIMARY_COLOR}
          animating={true}
        />
      </View>
    );
  };
  renderForm = () => {
    return (
      <View style={styles.form}>
        <Image
          source={require('../assets/main-icon.png')}
          style={styles.icon}
        />
        <Text style={styles.header}>Email OTP Verification</Text>
        <TextInput
          label={'OTP'}
          keyboardType="numeric"
          maxLength={6}
          value={this.state.otp}
          onChangeText={text => {
            this.setState({otp: text.trim()});
          }}
        />
        <Button
          style={styles.button}
          icon="send"
          mode={'contained'}
          onPress={this.onPressSubmit}>
          Submit
        </Button>
      </View>
    );
  };
  onPressSubmit = async () => {
    const emailFromAsyncStorage = await AsyncStorage.getItem('email');
    this.setState({isLoading: true});
    const verificationCode = this.state.otp.trim();
    Axios.post(activateUrl, {
      email: emailFromAsyncStorage,
      verificationCode: verificationCode,
    })
      .then(async response => {
        this.setState({isLoading: false});
        const ACCESS_TOKEN = response.data.data.accessToken;
        const MESSAGE = JSON.stringify(response.data.message);
        await AsyncStorage.setItem('ACCESS_TOKEN', ACCESS_TOKEN);
        this.props.navigation.navigate('App');
        // this.props.navigation.push();
      })
      .catch(error => {
        this.setState({isLoading: false});
        // console.log('error', error.response.data.error.message);
        alert(JSON.stringify(error.response.data));
      });
  };

  render() {
    const {isLoading} = this.state;
    return (
      <View style={styles.container}>
        {isLoading ? this.renderLoader() : this.renderForm()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND,
    flex: 1,
    justifyContent: 'center',
  },
  loaderBG: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    justifyContent: 'center',
    backgroundColor: BACKGROUND,
    paddingHorizontal: 16,
    paddingBottom: 150,
  },
  icon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    marginTop: 20,
    color: 'white',
  },
  login: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'black',
    textDecorationLine: 'underline',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default EmailOTP;
