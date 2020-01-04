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

class Register extends Component {
  state = {
    email: 'punchbala99@gmail.com',
    password: 'pass',
    confirmPassword: 'pass',
    isLoggingIn: false,
  };
  onPressRegister = async () => {
    try {
      this.setState({isLoggingIn: true});
      const {email, password, confirmPassword} = this.state;
      const check = (checkPasswordsMatch = () => {
        return password === confirmPassword;
      });
      if (check) {
        const response = await axios.post(URLS.REGISTER, {
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        });

        this.setState({isLoggingIn: false});
        await AsyncStorage.setItem('email', email);
        this.props.navigation.push('EmailOTP');
      } else {
        alert('Passwords Do not match!!!');
      }
    } catch (error) {
      alert(error.response.data.error.message);
    }
  };
  onPressLogin = () => {
    this.props.navigation.pop();
  };

  renderForm = () => {
    return (
      <View style={styles.form}>
        <Image
          source={require('../assets/main-icon.png')}
          style={styles.icon}
        />
        <Text style={styles.header}>Account Registration</Text>

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
        <TextInput
          theme={{
            colors: {
              primary: COLORS.PRIMARY_VARIANT,
            },
          }}
          style={styles.input}
          label={'Re-Enter Password'}
          secureTextEntry={true}
          maxLength={20}
          value={this.state.confirmPassword}
          onChangeText={text => {
            this.setState({confirmPassword: text.trim()});
          }}
        />

        <Button
          style={{marginTop: 20}}
          icon="account-plus"
          color={COLORS.PRIMARY}
          mode={'contained'}
          onPress={this.onPressRegister}>
          Register
        </Button>

        <Button
          icon="login"
          color={COLORS.PRIMARY}
          onPress={this.onPressLogin}
          style={styles.register}>
          Login
        </Button>
      </View>
    );
  };

  renderLoader = () => {
    return (
      <View
        source={require('../assets/account-creation.jpg')}
        style={styles.loaderBG}>
        <Text
          style={{color: COLORS.ON_SURFACE, fontSize: 18, fontWeight: '800'}}>
          Creating a New account...
        </Text>
        <ActivityIndicator
          animating={true}
          size="large"
          color={COLORS.PRIMARY}
        />
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
    backgroundColor: '#52b0f2',
    paddingHorizontal: 50,
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 50,
    color: 'white',
  },
  register: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 16,
    color: COLORS.SURFACE,
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

export default Register;
