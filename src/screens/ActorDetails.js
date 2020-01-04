import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  Image,
  TouchableHighlight,
} from 'react-native';
import * as COLORS from '../Constants/Colors';
import * as CONSTANTS from '../Constants/Constants';
import * as URLS from '../Constants/Url';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import {ActivityIndicator, Avatar} from 'react-native-paper';
import HorizontalList from '../components/HorizontalList';

const coverPicHeight = CONSTANTS.SCREEN_HEIGHT / 3.5;

class ActorDetails extends Component {
  state = {
    actorDetails: null,
    isLoading: false,
    overviewMaxLines: 3,
    cast: null,
    crew: null,
  };

  componentDidMount = () => {
    this.fetchActorDetails();
  };
  fetchActorDetails = async () => {
    try {
      const {actor, type} = this.props.navigation.state.params;
      const person_id = actor.id;
      this.setState({isLoading: true});
      const profileUrl =
        URLS.ACTOR_DETAILS_URL +
        `/${person_id}?api_key=${CONSTANTS.TMDB_API_KEY}`;
      const actorDetailsRawResponse = await axios.get(profileUrl);

      const personMovieCreditsUrl = `${URLS.ACTOR_DETAILS_URL}/${person_id}/movie_credits?api_key=${CONSTANTS.TMDB_API_KEY}`;
      const castCrewResponse = await axios.get(personMovieCreditsUrl);
      const {cast, crew} = castCrewResponse.data;

      const actorDetailsResponse = actorDetailsRawResponse.data;
      this.setState({
        actorDetails: actorDetailsResponse,
        cast: cast,
        crew: crew,
        isLoading: false,
      });
    } catch (error) {
      this.setState({isLoading: false});
      console.log(error);
    }
  };

  renderLoader = () => {
    const {isLoading} = this.state;
    return (
      isLoading && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
          }}>
          <Text>Loading...</Text>
          <ActivityIndicator size={'large'} color={COLORS.PRIMARY} />
        </View>
      )
    );
  };

  handleMovieCardPress = item => {
    this.props.navigation.navigate({
      routeName: 'MovieDetails',
      params: {movie: item},
      key: `MovieDetails_` + String(item.id),
    });
  };

  renderDynamicContents = () => {
    const {
      birthday,
      known_for_department,
      name,
      biography,
      place_of_birth,
      profile_path,
    } = this.state.actorDetails;
    const {overviewMaxLines, cast, crew} = this.state;

    const bday = new Date(birthday);
    const formattedBday = bday
      .toDateString()
      .split(' ')
      .slice(1)
      .join(' ');

    const actorPosterUrl = URLS.ACTOR_PROFILE_PATH + profile_path;

    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            height: coverPicHeight,
            position: 'absolute',
            top: -coverPicHeight / 4,
            left: 0,
            right: 0,
            zIndex: 10,
          }}>
          <View
            style={[
              {
                flex: 1.5,
              },
              styles.exactCenter,
            ]}>
            <FastImage
              source={{uri: actorPosterUrl}}
              style={styles.posterPic}
            />
          </View>
          <View
            style={{
              flex: 2.5,
              justifyContent: 'center',
              top: coverPicHeight / 8,
            }}>
            <Text style={styles.title}>{name}</Text>
            {formattedBday ? (
              <View style={styles.row}>
                <Avatar.Icon
                  size={20}
                  icon="calendar"
                  color={COLORS.PRIMARY}
                  style={{backgroundColor: COLORS.SURFACE}}
                />
                <Text style={styles.items}>
                  {formattedBday ? formattedBday : '-'}
                </Text>
              </View>
            ) : null}
            {place_of_birth ? (
              <View style={styles.row}>
                <Avatar.Icon
                  size={20}
                  icon="map-marker"
                  color={COLORS.PRIMARY}
                  style={{backgroundColor: COLORS.SURFACE}}
                />
                <Text style={styles.items}>
                  {place_of_birth ? place_of_birth : '-'}
                </Text>
              </View>
            ) : null}
            <View style={styles.row}>
              <Avatar.Icon
                size={20}
                icon="account-supervisor"
                color={COLORS.PRIMARY}
                style={{backgroundColor: COLORS.SURFACE}}
              />
              <Text style={styles.items}>{known_for_department}</Text>
            </View>
          </View>
        </View>
        <View>
          <Text
            style={[styles.caption]}
            numberOfLines={this.state.overviewMaxLines}
            onPress={() => {
              if (overviewMaxLines === 3) {
                this.setState({overviewMaxLines: 1000});
              } else {
                this.setState({overviewMaxLines: 3});
              }
            }}>
            {biography}
          </Text>
        </View>

        <HorizontalList
          title={'As Cast'}
          data={cast}
          type={'actor_cast'}
          onCardPress={this.handleMovieCardPress}
        />
        <HorizontalList
          title={'In Crew'}
          data={crew}
          type={'actor_crew'}
          onCardPress={this.handleMovieCardPress}
        />
      </View>
    );
  };

  handleBackArrowPress = () => {
    this.props.navigation.pop(1);
  };

  render() {
    const {actor} = this.props.navigation.state.params;
    const {profile_path} = actor;
    const actorCoverUrl = URLS.ACTOR_PROFILE_PATH + profile_path;
    const {actorDetails} = this.state;
    return (
      <ScrollView>
        <StatusBar translucent backgroundColor="transparent" />
        <TouchableHighlight
          style={styles.backArrowContainer}
          onPress={this.handleBackArrowPress}>
          <Avatar.Icon
            size={40}
            icon="arrow-left"
            color={COLORS.SURFACE}
            style={styles.backArrow}
          />
        </TouchableHighlight>
        <Image
          source={{uri: actorCoverUrl}}
          style={styles.coverPic}
          blurRadius={0}
        />
        <View style={styles.container}>
          {this.state.actorDetails === null
            ? this.renderLoader()
            : this.renderDynamicContents()}
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  coverPic: {
    width: CONSTANTS.SCREEN_WIDTH,
    height: CONSTANTS.SCREEN_HEIGHT / 3.5,
  },
  container: {
    backgroundColor: COLORS.SURFACE,
    paddingHorizontal: 4,
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  items: {
    color: COLORS.ON_BACKGROUND,
    fontSize: 12,
    paddingHorizontal: 4,
  },
  gradient: {
    position: 'absolute',
    width: CONSTANTS.SCREEN_WIDTH,
    top: -24,
    height: 24,
  },
  caption: {
    textAlign: 'justify',
    paddingVertical: 4,
    color: COLORS.ON_BACKGROUND,
    marginTop: coverPicHeight * 0.75,
  },
  posterPic: {
    width: CONSTANTS.SCREEN_WIDTH * (1.3 / 4),
    height: coverPicHeight * 0.9,
    borderRadius: 8,
    borderColor: COLORS.SURFACE,
    borderWidth: 2,
  },
  exactCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrowContainer: {
    position: 'absolute',
    zIndex: 99,
    top: coverPicHeight / 8,
    left: 20,
  },
  backArrow: {
    backgroundColor: '#FFFFFF66',
  },
  row: {
    flexDirection: 'row',
  },
});
export default ActorDetails;
