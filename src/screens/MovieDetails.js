import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import * as COLORS from '../Constants/Colors';
import * as CONSTANTS from '../Constants/Constants';
import * as URLS from '../Constants/Url';
import FastImage from 'react-native-fast-image';
import Axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator, Avatar} from 'react-native-paper';
import {Rating} from 'react-native-ratings';
import MoviesSection from '../components/MoviesSection';
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

  renderDynamicContents = () => {
    const {
      release_date,
      runtime,
      genres,
      overview,
      vote_average,
      vote_count,
      revenue,
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
        <View style={{paddingTop: 16}}>
          <Text style={styles.items}>
            {releaseYear} {'\u2022'} {formattedRunTime}
          </Text>
        </View>
        <View>
          <Text style={[styles.items]}>{genresFormatted.join(', ')}</Text>
        </View>
        <View>
          <Text
            style={[styles.caption]}
            numberOfLines={this.state.overviewMaxLines}
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
        <MoviesSection title={'Top-Billed Cast'} data={cast} type={'cast'} />
        <MoviesSection title={'Crew'} data={crew} type={'crew'} />
      </View>
    );
  };

  render() {
    const {movie} = this.props.navigation.state.params;
    const {cover_url, title} = movie;
    return (
      <ScrollView>
        <FastImage source={{uri: cover_url}} style={styles.coverPic} />
        <View style={styles.container}>
          <LinearGradient
            colors={['transparent', COLORS.SURFACE, COLORS.SURFACE]}
            style={styles.gradient}>
            <Text style={styles.title}>{title}</Text>
          </LinearGradient>
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
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    zIndex: 99,
    paddingHorizontal: 4,
  },
  items: {
    color: COLORS.ON_BACKGROUND,
    fontSize: 12,
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
    top: -20,
    position: 'absolute',
    width: CONSTANTS.SCREEN_WIDTH,
  },
  caption: {
    textAlign: 'justify',
    paddingVertical: 4,
    color: COLORS.ON_BACKGROUND,
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
});
export default MovieDetails;
