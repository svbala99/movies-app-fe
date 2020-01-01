import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import * as CONSTANTS from '../Constants/Constants';
import MovieDetails from '../screens/MovieDetails';

class MoviesSectionCarousel extends Component {
  state = {
    activeSlideIndex: 0,
  };

  handleSlideChange = slideIndex => {
    this.setState({activeSlideIndex: slideIndex});
  };

  handleMovieClick = id => {
    return (
      <View>
        <Text>Hello</Text>
      </View>
    );
  };

  renderMovieItem = ({item, index}) => {
    const {cover_url, title} = item;
    const {id} = item;
    const {onCarouselSlidePress} = this.props;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          onCarouselSlidePress(item);
        }}>
        <FastImage
          source={{uri: cover_url, priority: FastImage.priority.high}}
          style={styles.carouselItem}
        />
      </TouchableOpacity>
    );
  };
  renderMoviesList = data => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          data={data}
          renderItem={this.renderMovieItem}
          sliderWidth={CONSTANTS.SCREEN_WIDTH}
          itemWidth={CONSTANTS.SCREEN_WIDTH}
          enableMomentum={false}
          lockScrollWhileSnapping={true}
          autoplay={true}
          autoplayInterval={3000}
          enableSnap={true}
          // loop={true}
          removeClippedSubviews={true}
          onSnapToItem={this.handleSlideChange}
        />
        <Pagination
          dotsLength={data.length}
          activeDotIndex={this.state.activeSlideIndex}
          containerStyle={{
            position: 'absolute',
            bottom: -10,
          }}
          removeClippedSubviews={false}
          dotStyle={{backgroundColor: 'white'}}
        />
      </View>
    );
  };
  render() {
    const {title, data} = this.props;
    return (
      <View style={styles.list}>
        <Text style={styles.caption}>{title}</Text>
        {this.renderMoviesList(data)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {alignItems: 'center'},
  caption: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    paddingVertical: 8,
  },
  carouselItem: {
    width: CONSTANTS.SCREEN_WIDTH - 10,
    height: CONSTANTS.SCREEN_HEIGHT / 4,
    borderRadius: 4,
    alignItems: 'center',
    padding: 16,
  },
});
export default MoviesSectionCarousel;
