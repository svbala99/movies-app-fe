import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import * as COLORS from '../Constants/Colors';
import * as CONSTANTS from '../Constants/Constants';
import * as URLS from '../Constants/Url';
import axios from 'axios';
import Loader from '../components/Loader';
import FastImage from 'react-native-fast-image';
import {Avatar} from 'react-native-paper';
class ActorDetails extends Component {
  state = {
    actorDetails: null,
    isLoading: false,
    overviewMaxLines: 4,
  };
  componentDidMount() {
    this.fetchActorDetails();
  }
  fetchActorDetails = async () => {
    try {
      const {actor, type} = this.props.navigation.state.params;
      const person_id = actor.id;
      const profileUrl =
        URLS.ACTOR_DETAILS_URL +
        `/${person_id}?api_key=${CONSTANTS.TMDB_API_KEY}`;
      const actorDetailsRawResponse = await axios.get(profileUrl);
      const actorDetailsResponse = actorDetailsRawResponse.data;
      this.setState({actorDetails: actorDetailsResponse, isLoading: false});
    } catch (error) {
      this.setState({isLoading: false});
      console.log(error);
    }
  };

  renderLoader = () => {
    const {isLoading} = this.state;
    return isLoading && <Loader />;
  };
  renderDOBPlace = () => {
    const {birthday, place_of_birth} = this.state.actorDetails;
    return (
      <View>
        <View style={[styles.row, {alignItems: 'center'}]}>
          <Avatar.Icon
            size={24}
            icon="calendar"
            color={COLORS.PRIMARY}
            style={{backgroundColor: COLORS.SURFACE}}
          />
          <Text style={styles.dobPlace}>{birthday}</Text>
        </View>

        <View style={styles.row}>
          <Avatar.Icon
            size={24}
            icon="map-marker"
            color={COLORS.PRIMARY}
            style={{backgroundColor: COLORS.SURFACE}}
          />
          <Text numberOfLines={2} style={styles.dobPlace}>
            {place_of_birth}
          </Text>
        </View>
      </View>
    );
  };
  renderDynamicContents = () => {};

  render() {
    const {actor, type} = this.props.navigation.state.params;
    const {profile_path, id, name} = actor;
    const actorPosterUrl = URLS.ACTOR_PROFILE_PATH + profile_path;
    const {actorDetails} = this.state;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <FastImage
            source={{uri: actorPosterUrl}}
            style={[styles.coverPic, styles.horizontalPadding]}
          />
          <View style={[styles.nameDobPlace, styles.horizontalPadding]}>
            <View style={styles.row}>
              <Avatar.Icon
                size={24}
                icon="account"
                color={COLORS.PRIMARY}
                style={{backgroundColor: COLORS.SURFACE}}
              />
              <Text numberOfLines={2} style={styles.name}>
                {name}
              </Text>
            </View>
            {actorDetails === null
              ? this.renderLoader()
              : this.renderDOBPlace()}
          </View>
        </View>
        {/* {actorDetails === null
          ? this.renderLoader()
          : this.renderDynamicContents()} */}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
  },
  coverPic: {
    width: CONSTANTS.SCREEN_WIDTH / 2.75,
    height: CONSTANTS.SCREEN_HEIGHT / 3,
    borderRadius: 4,
  },
  horizontalPadding: {
    paddingHorizontal: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  nameDobPlace: {
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  dobPlace: {
    fontSize: 12,
  },
});

export default ActorDetails;
