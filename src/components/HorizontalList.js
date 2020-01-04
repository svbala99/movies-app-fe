import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MovieCard from './MovieCard';
class MoviesSection extends Component {
  renderMovieItem = ({item, index}) => {
    const {type, onCardPress} = this.props;
    return (
      <TouchableOpacity onPress={() => onCardPress(item)}>
        <MovieCard data={item} type={type} />
      </TouchableOpacity>
    );
  };
  renderMoviesList = data => {
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
    const {title, data} = this.props;
    return (
      <View style={styles.list}>
        {data.length ? <Text style={styles.caption}>{title}</Text> : null}
        {this.renderMoviesList(data)}
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
