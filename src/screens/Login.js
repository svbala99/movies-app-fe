import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import {TextInput, Button, ActivityIndicator} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import * as URLS from '../Constants/Url';
import * as COLORS from '../Constants/Colors';

class Login extends Component {
  state = {
    email: 'gopal221296@gmail.com',
    password: 'pass',
    isLoggingIn: false,
  };

  onPressLogin = async () => {
    try {
      this.setState({isLoggingIn: true});
      const response = await axios
        .post(URLS.LOGIN, {
          email: this.state.email,
          password: this.state.password,
        })
        .then(async response => {
          const ACCESS_TOKEN = JSON.stringify(response.data.data.accessToken);
          await AsyncStorage.setItem('ACCESS_TOKEN', ACCESS_TOKEN);
          this.setState({isLoggingIn: false, email: null, password: null});
          this.props.navigation.navigate('App');
        })
        .catch(error => {
          this.setState({isLoggingIn: false, password: null});
          alert('Invalid credentials.. Try again!!!');
          console.log('====================================');
          console.log(JSON.stringify(error));
          console.log('====================================');
        });
    } catch (error) {
      this.setState({isLoggingIn: false, password: null});
      alert('Oops.. Something went wrong.. Try again!!!');
      console.log('====================================');
      console.log(JSON.stringify(error));
      console.log('====================================');
    }
  };
  onPressRegister = () => {
    this.props.navigation.push('Register');
  };

  renderForm = () => {
    return (
      <View style={styles.form}>
        <Image
          source={require('../assets/main-icon.png')}
          style={styles.icon}
        />
        <Text style={styles.header}>Welcome Back</Text>

        <TextInput
          theme={{
            colors: {
              primary: COLORS.PRIMARY_VARIANT,
            },
          }}
          style={styles.input}
          label={'Email'}
          keyboardType="email-address"
          maxLength={40}
          value={this.state.email}
          onChangeText={text => {
            this.setState({email: text.trim()});
          }}
        />
        <TextInput
          theme={{
            colors: {
              primary: COLORS.PRIMARY_VARIANT,
            },
          }}
          style={styles.input}
          label={'Password'}
          secureTextEntry={true}
          maxLength={20}
          value={this.state.password}
          onChangeText={text => {
            this.setState({password: text.trim()});
          }}
        />

        <Button
          style={{marginTop: 20}}
          icon="login"
          color={COLORS.PRIMARY}
          mode={'contained'}
          onPress={this.onPressLogin}>
          Login
        </Button>

        <Button
          icon="account-plus"
          color={COLORS.PRIMARY}
          onPress={this.onPressRegister}
          style={styles.register}>
          Register
        </Button>
      </View>
    );
  };

  renderLoader = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Text>Logging in...</Text>
        <ActivityIndicator size={'large'} color={COLORS.PRIMARY} />
      </View>
    );
  };

  render() {
    const {isLoggingIn} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.SURFACE} barStyle="dark-content" />
        {isLoggingIn ? this.renderLoader() : this.renderForm()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.SURFACE,
    flex: 1,
    justifyContent: 'center',
  },
  loaderBG: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: 16,
    justifyContent: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    paddingHorizontal: 50,
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 50,
  },
  register: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    backgroundColor: COLORS.SURFACE,
  },
});

export default Login;
