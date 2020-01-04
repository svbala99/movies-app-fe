import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  StatusBar,
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {ActivityIndicator, Avatar} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import Topbar from '../components/Topbar';
import FastImage from 'react-native-fast-image';

import * as COLORS from '../Constants/Colors';
import * as CONSTANTS from '../Constants/Constants';
import * as URLS from '../Constants/Url';

import axios from 'axios';
import MovieCard from '../components/MovieCard';

class Search extends Component {
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

  fetchFeed = async () => {
    const {isLoading, results, currentPage, lastPage} = this.state;

    if ((currentPage != -1 && currentPage === lastPage) || isLoading) {
      return null;
    }
    this.setState({isLoading: true});

    let page = currentPage == -1 ? 1 : currentPage + 1;
    try {
      const {data: responseData} = await axios.get(
        `${URLS.TRENDING}&page=${page}`,
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

  handleLogoutPress = async () => {
    this.setState({isLoggingOut: true});
    await AsyncStorage.clear();
    setTimeout(() => {
      this.setState({isLoggingOut: false});
      this.props.navigation.navigate('Auth');
    }, 100);
  };

  renderLogoutLoader = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Text>Logging Out...</Text>
        <ActivityIndicator size={'large'} color={COLORS.PRIMARY} />
      </View>
    );
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
            marginBottom: containerHeight,
          }}>
          <Text>Loading...</Text>
          <ActivityIndicator size={'large'} color={COLORS.PRIMARY} />
        </View>
      )
    );
  };

  renderFeed = () => {
    const {isLoading, results} = this.state;
    return (
      <FlatList
        data={results}
        renderItem={this.renderFeedItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={this.fetchFeed}
        ListFooterComponent={this.renderLoader}
        extraData={{isLoading}}
      />
    );
  };

  renderFeedItem = ({item, index}) => {
    const backDropUrl = URLS.BACKDROP_IMAGE_LOWRES + item.backdrop_path;
    return (
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: COLORS.BACKGROUND,
          borderBottomWidth: 0.5,
        }}>
        <View style={{flex: 1}}>
          <TouchableOpacity>
            <MovieCard data={item} type={'movies_trending'} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 2,
            marginLeft: 24,
            marginRight: 2,
            justifyContent: 'center',
          }}>
          <Text numberOfLines={2} style={{fontWeight: 'bold'}}>
            {item.title}
          </Text>
          <Text style={{fontSize: 12}}>{`${
            item.release_date.split('-')[0]
          } | ${item.original_language.toUpperCase()}`}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar.Icon
              size={24}
              icon="star"
              color={'#f1c40f'}
              style={{backgroundColor: COLORS.SURFACE}}
            />
            <Text style={{fontSize: 10}}>{item.vote_average}</Text>
          </View>
        </View>
      </View>
    );
  };

  handleMovieCardPress = item => {
    this.props.navigation.navigate({
      routeName: 'MovieDetails',
      params: {movie: item},
      key: `MovieDetails_` + String(item.id),
    });
  };

  render() {
    const {isLoggingOut} = this.state;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.PRIMARY} />

        {isLoggingOut ? (
          this.renderLogoutLoader()
        ) : (
          <View>
            <Topbar onLogoutPress={this.handleLogoutPress} />
            {this.renderFeed()}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.SURFACE,
    flex: 1,
  },
});

export default Search;
