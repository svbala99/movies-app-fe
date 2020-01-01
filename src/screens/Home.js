import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Topbar from '../components/Topbar';
import * as COLORS from '../Constants/Colors';
import axios from 'axios';
import * as URL from '../Constants/Url';
import * as CONSTANTS from '../Constants/Constants';
import MoviesSection from '../components/MoviesSection';
import MoviesSectionCarousel from '../components/MoviesSectionCarousel';

const RESULTS_LIMIT = 4;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      results: [],
      currentPage: -1,
      lastPage: 0,
      isLoggingOut: false,
    };
  }

  componentDidMount = () => {
    this.fetchFeed();
  };

  onPressLogout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  fetchFeed = async () => {
    const {isLoading, results, currentPage, lastPage} = this.state;

    if ((currentPage != -1 && currentPage === lastPage) || isLoading) {
      return null;
    }
    this.setState({isLoading: true});

    let page = currentPage == -1 ? 1 : currentPage + 1;
    try {
      isLoading;
      const {data: responseData} = await axios.get(
        URL.USER_FEED + `?limit=${RESULTS_LIMIT}&page=${page}`,
      );
      const updatedResults = [...results, ...responseData.results];
      let updatedLastPage = responseData.total_pages;
      this.setState({
        isLoading: false,
        results: updatedResults,
        currentPage: page,
        lastPage: updatedLastPage,
      });
    } catch (error) {
      this.setState({isLoading: false});
      console.log(error);
    }
  };

  handleCarouselSlidePress = item => {
    this.props.navigation.navigate({
      routeName: 'MovieDetails',
      params: {movie: item},
      key: `MovieDetails_` + String(item.id),
    });
  };

  renderFeedItem = ({item, index}) => {
    const {type, title, data} = item;
    if (type === CONSTANTS.CAROUSEL) {
      return (
        <MoviesSectionCarousel
          title={title}
          data={data}
          onCarouselSlidePress={this.handleCarouselSlidePress}
        />
      );
    } else if (type === CONSTANTS.HORIZONTAL_LIST) {
      return <MoviesSection title={title} data={data} type={'movies'} />;
    } else {
      return null;
    }
  };

  renderLoader = () => {
    const {isLoading, results} = this.state;
    const containerHeight =
      isLoading && results.length === 0 ? CONSTANTS.SCREEN_HEIGHT * 0.75 : 100;
    return (
      this.state.isLoading && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: containerHeight,
          }}>
          <Text>Loading...</Text>
          <ActivityIndicator size={'large'} color={COLORS.PRIMARY} />
        </View>
      )
    );
  };

  renderFeed = () => {
    const {isLoading} = this.state;
    return (
      <FlatList
        data={this.state.results}
        renderItem={this.renderFeedItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={this.fetchFeed}
        ListFooterComponent={this.renderLoader}
        extraData={{isLoading}}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.PRIMARY} />
        <Topbar />
        {this.renderFeed()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
});

export default Home;
