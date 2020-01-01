import React, {Component} from 'react';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';
import MovieCard from './MovieCard';
class MoviesSection extends Component {
  renderMovieItem = ({item, index}) => {
    const {type} = this.props;
    return <MovieCard data={item} type={type} />;
  };
  renderMoviesList = (data, type) => {
    return (
      <FlatList
        data={data}
        renderItem={this.renderMovieItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    );
  };
  render() {
    const {title, data, type} = this.props;
    return (
      <View style={styles.list}>
        <Text style={styles.caption}>{title}</Text>
        {this.renderMoviesList(data, type)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  caption: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    paddingVertical: 2,
  },
});
export default MoviesSection;
