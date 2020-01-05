import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  StatusBar,
  View,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {ActivityIndicator, Avatar} from 'react-native-paper';
import {SearchBar} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Topbar from '../components/Topbar';

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
      currentPage: 1,
      isEndReached: false,
      isLoggingOut: false,
      query: '',
      isNoResults: false,
    };
  }

  componentWillUnmount = () => {
    this.setState({
      results: [],
      query: '',
      currentPage: 1,
      isEndReached: false,
    });
  };

  fetchFeed = async () => {
    const {
      isLoading,
      currentPage,
      query: queryInput,
      isEndReached,
      isNoResults,
      results,
    } = this.state;
    if (isEndReached || isLoading || queryInput === '') {
      return;
    }
    try {
      const {data: responseData} = await axios.get(
        `${URLS.SEARCH_MOVIES}&query=${queryInput}&page=${currentPage}`,
      );
      const updatedResults = responseData.results;
      if (updatedResults.length === 0) {
        this.setState({isNoResults: true});
        return;
      }

      let {total_pages, page} = responseData;

      this.setState({
        results: page == 1 ? updatedResults : [...results, ...updatedResults],
        currentPage: currentPage + 1,
        isEndReached: page >= total_pages,
      });
    } catch (error) {
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

  renderNoResults = () => {
    const {isNoResults} = this.state;
    return (
      isNoResults && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
          }}>
          <Text style={{color: COLORS.ERROR}}>No results found...</Text>
        </View>
      )
    );
  };

  renderFeed = () => {
    const {isLoading, results, query} = this.state;
    return (
      <View>
        <SearchBar
          onClear={() => {
            this.setState({
              results: [],
              query: '',
              currentPage: 1,
              isEndReached: false,
              isNoResults: false,
            });
          }}
          placeholder="Search movies"
          onChangeText={inputText => {
            this.setState(
              {
                query: inputText,
                currentPage: 1,
                results: [],
                isEndReached: false,
                isNoResults: false,
              },
              () => {
                this.fetchFeed();
              },
            );
          }}
          value={query}
          containerStyle={{
            backgroundColor: COLORS.SURFACE,
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
          }}
          inputContainerStyle={{backgroundColor: '#e5e5e5'}}
        />
        {this.renderNoResults()}

        <FlatList
          style={{marginBottom: 250}}
          data={query.trim() === '' ? [] : results}
          renderItem={this.renderFeedItem}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={this.fetchFeed}
          ListFooterComponent={this.renderLoader}
          extraData={{isLoading}}
          onScrollBeginDrag={() => {
            Keyboard.dismiss();
          }}
        />
      </View>
    );
  };

  handleMovieCardPress = item => {
    if (item.backdrop_path == null) {
      alert('No Further details available');
      return;
    }
    this.props.navigation.navigate({
      routeName: 'MovieDetails',
      params: {movie: item},
      key: `MovieDetails_` + String(item.id),
    });
  };

  renderFeedItem = ({item, index}) => {
    const backDropUrl = URLS.BACKDROP_IMAGE_LOWRES + item.backdrop_path;
    return (
      <TouchableOpacity
        onPress={() => this.handleMovieCardPress(item)}
        style={{
          flexDirection: 'row',
          borderBottomColor: COLORS.BACKGROUND,
          borderBottomWidth: 0.5,
        }}>
        <View style={{flex: 1}}>
          <MovieCard data={item} type={'movies_trending'} />
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
          {item.release_date ? (
            <Text style={{fontSize: 12}}>{`${
              item.release_date.split('-')[0]
            } | ${item.original_language.toUpperCase()}`}</Text>
          ) : null}
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
      </TouchableOpacity>
    );
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
  input: {
    marginHorizontal: 8,
    marginVertical: 4,
  },
});

export default Search;
