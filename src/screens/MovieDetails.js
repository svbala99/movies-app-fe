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
import Axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator, Avatar} from 'react-native-paper';
import {Rating} from 'react-native-ratings';
import HorizontalList from '../components/HorizontalList';

const coverPicHeight = CONSTANTS.SCREEN_HEIGHT / 3.5;

class MovieDetails extends Component {
  state = {
    movieDetails: null,
    isLoading: false,
    cast: null,
    crew: null,
    overviewMaxLines: 3,
  };

  static navigationOptions = {
    headerStyle: {
      backgroundColor: 'transparent',
    },
  };
  componentDidMount = () => {
    this.fetchMovieDetails();
  };

  fetchMovieDetails = async () => {
    try {
      const {movie} = this.props.navigation.state.params;
      this.setState({isLoading: true});
      const movieDetailsResponse = await Axios.get(
        `${URLS.MOVIE_DETAILS_URL}/${movie.id}?api_key=${CONSTANTS.TMDB_API_KEY}`,
      );
      const castCrewResponse = await Axios.get(
        `${URLS.MOVIE_DETAILS_URL}/${movie.id}/credits?api_key=${CONSTANTS.TMDB_API_KEY}`,
      );
      const {cast, crew} = castCrewResponse.data;
      this.setState({
        movieDetails: movieDetailsResponse.data,
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

  handleActorCardPress = item => {
    this.props.navigation.navigate({
      routeName: 'ActorDetails',
      params: {actor: item},
      key: `ActorDetails_` + String(item.id),
    });
  };

  renderDynamicContents = () => {
    const {
      title,
      release_date,
      runtime,
      genres,
      overview,
      vote_average,
      vote_count,
      revenue,
      poster_path,
    } = this.state.movieDetails;
    const {cast, crew, overviewMaxLines} = this.state;
    const releaseYear = new Date(release_date).getFullYear();

    const runTimeHrs = Math.floor(runtime / 60);
    const runTimeMins = runtime - runTimeHrs * 60;
    const formattedRunTime = `${runTimeHrs} hr ${runTimeMins} mins`;
    const genresFormatted = genres.map(element => element.name);

    const formattedRevenue =
      Math.abs(Number(revenue)) >= 1.0e9
        ? Math.round((Math.abs(Number(revenue)) / 1.0e9) * 100) / 100 + 'B'
        : // Six Zeroes for Millions
        Math.abs(Number(revenue)) >= 1.0e6
        ? Math.round((Math.abs(Number(revenue)) / 1.0e6) * 100) / 100 + 'M'
        : // Three Zeroes for Thousands
        Math.abs(Number(revenue)) >= 1.0e3
        ? Math.round((Math.abs(Number(revenue)) / 1.0e3) * 100) / 100 + 'K'
        : Math.abs(Number(revenue));
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
              source={{uri: URLS.BACKDROP_IMAGE_PREFIX + poster_path}}
              style={styles.posterPic}
            />
          </View>
          <View
            style={{
              flex: 2.5,
              justifyContent: 'center',
            }}>
            <Text numberOfLines={2} style={styles.title}>
              {title}
            </Text>
            <Text style={styles.items}>
              {releaseYear} {'\u2022'} {formattedRunTime}
            </Text>
            <Text style={[styles.items]}>{genresFormatted.join(', ')}</Text>
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
            {overview}
          </Text>
        </View>
        <View style={styles.ratingCollection}>
          <View style={styles.ratingCollectionBoxes}>
            <Rating
              showRating
              ratingCount={10}
              startingValue={vote_average}
              imageSize={12}
              ratingBackgroundColor={COLORS.SURFACE}
              ratingTextColor={COLORS.ON_BACKGROUND}
              style={{height: 30}}
            />
            <Text
              style={{fontSize: 12, top: 32}}>{`(${vote_count} votes)`}</Text>
          </View>
          <View style={styles.verticalSeparator}></View>
          <View
            style={[
              styles.ratingCollectionBoxes,
              {justifyContent: 'space-between'},
            ]}>
            <Avatar.Icon
              size={48}
              icon="archive"
              color={'#f1c40f'}
              style={{backgroundColor: COLORS.SURFACE}}
            />
            <Text style={{fontWeight: 'bold', fontSize: 18}}>
              {formattedRevenue}
            </Text>
            <Text style={{fontSize: 12}}>Box Office</Text>
          </View>
        </View>

        <HorizontalList
          title={'Top-Billed Cast'}
          data={cast}
          type={'cast'}
          onCardPress={this.handleActorCardPress}
        />
        <HorizontalList
          title={'Crew'}
          data={crew}
          type={'crew'}
          onCardPress={this.handleActorCardPress}
        />
      </View>
    );
  };

  handleBackArrowPress = () => {
    this.props.navigation.pop(1);
  };

  render() {
    const {movie} = this.props.navigation.state.params;
    const {backdrop_path, title} = movie;
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
          source={{uri: URLS.BACKDROP_IMAGE_PREFIX + backdrop_path}}
          style={styles.coverPic}
          blurRadius={0}
        />
        <View style={styles.container}>
          {/* <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text> */}
          {this.state.movieDetails === null
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
    padding: 4,
  },
  separator: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    height: 4,
    width: 4,
    top: 10,
    backgroundColor: COLORS.ON_BACKGROUND,
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
  ratingCollection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ratingCollectionBoxes: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  verticalSeparator: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 2,
    backgroundColor: 'lightgray',
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
});
export default MovieDetails;
