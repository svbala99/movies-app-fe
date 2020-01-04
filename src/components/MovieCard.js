import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, Dimensions} from 'react-native';
import * as COLORS from '../Constants/Colors';
import * as URLS from '../Constants/Url';
import * as CONSTANTS from '../Constants/Constants';
import FastImage from 'react-native-fast-image';
import {Avatar} from 'react-native-paper';
const CARD_WIDTH = CONSTANTS.SCREEN_WIDTH / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.5;
class MovieCard extends Component {
  render() {
    const {data, type} = this.props;
    if (type === 'movies') {
      const {poster_path, title, vote_average} = data;
      const posterUrl = poster_path
        ? URLS.POSTER_IMAGE_PREFIX + poster_path
        : null;
      return posterUrl ? (
        <View style={styles.card}>
          <FastImage style={styles.poster} source={{uri: posterUrl}} />
          <View>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Avatar.Icon
                size={24}
                icon="star"
                color={'#f1c40f'}
                style={{backgroundColor: COLORS.SURFACE}}
              />
              <Text style={styles.subText} numberOfLines={1}>
                {`${vote_average}`}
              </Text>
            </View>
          </View>
        </View>
      ) : null;
    } else if (type === 'movies_trending') {
      const {poster_path} = data;
      const posterUrl = poster_path
        ? URLS.POSTER_IMAGE_PREFIX + poster_path
        : null;
      return posterUrl ? (
        <View style={styles.card}>
          <FastImage style={styles.poster} source={{uri: posterUrl}} />
        </View>
      ) : null;
    } else if (type === 'cast') {
      const {name, character, profile_path} = data;
      const posterUrl = profile_path
        ? URLS.POSTER_IMAGE_PREFIX + profile_path
        : null;
      return posterUrl ? (
        <View style={styles.card}>
          <FastImage style={styles.poster} source={{uri: posterUrl}} />
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.subText} numberOfLines={1}>
              {character}
            </Text>
          </View>
        </View>
      ) : null;
    } else if (type === 'crew') {
      const {name, department, profile_path} = data;
      const posterUrl = profile_path
        ? URLS.POSTER_IMAGE_PREFIX + profile_path
        : null;
      return posterUrl ? (
        <View style={styles.card}>
          <FastImage style={styles.poster} source={{uri: posterUrl}} />
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.subText} numberOfLines={1}>
              {department}
            </Text>
          </View>
        </View>
      ) : null;
    } else if (type === 'actor_cast') {
      const {character, title, poster_path} = data;
      const posterUrl = poster_path
        ? URLS.POSTER_IMAGE_PREFIX + poster_path
        : null;
      return posterUrl ? (
        <View style={styles.card}>
          <FastImage style={styles.poster} source={{uri: posterUrl}} />
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subText}>{character}</Text>
          </View>
        </View>
      ) : null;
    } else if (type === 'actor_crew') {
      const {job, title, poster_path} = data;
      const posterUrl = poster_path
        ? URLS.POSTER_IMAGE_PREFIX + poster_path
        : null;
      return posterUrl ? (
        <View style={styles.card}>
          <FastImage style={styles.poster} source={{uri: posterUrl}} />
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subText} numberOfLines={1}>
              {job}
            </Text>
          </View>
        </View>
      ) : null;
    }
  }
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH + 2 + 2,
    borderRadius: 2,
    alignSelf: 'stretch',
    padding: 2,
  },
  poster: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 8,
  },
  title: {
    color: COLORS.ON_BACKGROUND,
    textAlign: 'center',
    fontSize: 12,
  },
  subText: {
    fontSize: 10,
    textAlign: 'center',
  },
});
export default MovieCard;
