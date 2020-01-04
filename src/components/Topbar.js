import * as React from 'react';
import {Appbar, Avatar} from 'react-native-paper';
import {StyleSheet, View, Text, Button} from 'react-native';
import * as COLORS from '../Constants/Colors';
import * as CONSTANTS from '../Constants/Constants';
import Modal from 'react-native-modal';
import {TouchableHighlight} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

export default class Topbar extends React.Component {
  state = {
    isModalVisible: false,
  };
  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  render() {
    const {title = '', onLogoutPress} = this.props;
    return (
      <View>
        <Appbar.Header style={styles.appbarStyle}>
          <Avatar.Icon size={40} icon="menu" style={{backgroundColor: null}} />
          <Appbar.Content title="Movies App" />
          <Appbar.Action
            icon="dots-horizontal"
            color={CONSTANTS.SURFACE}
            onPress={this.toggleModal}
          />
        </Appbar.Header>
        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={() => this.setState({isModalVisible: false})}>
          <View style={styles.modalStyle}>
            <Text style={styles.modalText}>{'Do you want to logout?'}</Text>
            <View style={styles.row}>
              <TouchableHighlight style={styles.yesNo}>
                <Text onPress={this.toggleModal} style={styles.modalText}>
                  No
                </Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.yesNo}>
                <Text
                  onPress={() => {
                    this.toggleModal();
                    onLogoutPress();
                  }}
                  style={styles.modalText}>
                  Yes
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appbarStyle: {
    backgroundColor: COLORS.PRIMARY_VARIANT,
  },
  modalStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    color: COLORS.SURFACE,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backArrow: {
    backgroundColor: 'transparent',
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yesNo: {
    backgroundColor: '#128C7EDD',
    marginHorizontal: CONSTANTS.SCREEN_WIDTH / 10,
    marginVertical: 40,
    borderRadius: 50,
    width: 56,
    height: 56,
    justifyContent: 'center',
  },
});
