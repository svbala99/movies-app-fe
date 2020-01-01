import * as React from 'react';
import {
  Appbar,
  Avatar,
  Menu,
  Divider,
  Provider,
  Button,
} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import * as COLORS from '../Constants/Colors';

export default class Topbar extends React.Component {
  state = {
    menuVisible: false,
  };
  openMenu = () => {
    this.setState({menuVisible: true});
  };
  closeMenu = () => {
    this.setState({menuVisible: false});
  };
  renderMenu = () => {
    return (
      <Provider>
        <View
          style={{
            marginTop: -20,
            marginLeft: 40,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Menu
            visible={this.state.menuVisible}
            onDismiss={this.closeMenu}
            anchor={
              <Avatar.Icon
                size={40}
                icon="dots-horizontal"
                style={{backgroundColor: null}}
                onPress={this.openMenu}
              />
            }>
            <Menu.Item onPress={() => {}} title="Log Out" />
            <Menu.Item onPress={() => {}} title="Some other menu" />
            <Divider />
            <Menu.Item onPress={() => {}} title="Help" />
          </Menu>
        </View>
      </Provider>
    );
  };
  render() {
    const {title = ''} = this.props;
    return (
      <Appbar.Header style={styles.appbarStyle}>
        <Avatar.Icon size={40} icon="menu" style={{backgroundColor: null}} />
        <Appbar.Content title="Movies App" />
        <Appbar.Action
          icon="dots-horizontal"
          onPress={() => alert('Pressed label')}
        />
        {/* {this.renderMenu()} */}
      </Appbar.Header>
    );
  }
}

const styles = StyleSheet.create({
  appbarStyle: {
    backgroundColor: COLORS.PRIMARY_VARIANT,
    color: 'white',
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
