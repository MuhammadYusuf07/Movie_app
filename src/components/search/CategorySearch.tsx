import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_ACCESS_TOKEN } from '@env';

const categories = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];

const CategorySearch = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [movies, setMovies] = useState<any[]>([]);
  const navigation = useNavigation();

  const fetchMoviesByCategory = async (category: string) => {
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${getGenreId(
      category
    )}&language=en-US&page=1`;
    const options = {
      headers: {
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        Accept: 'application/json',
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(`Movies in category ${category}:`, data.results);
      setMovies(data.results); // Set hasil pencarian ke state movies
    } catch (error) {
      console.error(`Error fetching movies in category ${category}:`, error);
      Alert.alert('Error', 'Failed to fetch movies');
    }
  };

  const navigateToMovieDetail = (movieId: number) => {
    navigation.navigate('MovieDetail', { id: movieId });
  };

  const renderMovieItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigateToMovieDetail(item.id)}>
      <View style={styles.movieItem}>
        <Text style={styles.movieTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (selectedCategory) {
      fetchMoviesByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const getGenreId = (category: string): number => {
    switch (category.toLowerCase()) {
      case 'action':
        return 28;
      case 'adventure':
        return 12;
      case 'comedy':
        return 35;
      case 'drama':
        return 18;
      case 'fantasy':
        return 14;
      case 'horror':
        return 27;
      case 'romance':
        return 10749;
      case 'sci-fi':
        return 878;
      case 'thriller':
        return 53;
      default:
        return 0;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Pilih kategori:</Text>
      <View style={styles.categoryList}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              { backgroundColor: category === selectedCategory ? '#8978A4' : '#C0B4D5' },
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {movies.length > 0 && (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.movieList}
        />
      )}

      {movies.length === 0 && selectedCategory && (
        <Text style={styles.noResults}>Tidak ada film ditemukan dalam kategori ini.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C0B4D5',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 5,
  },
  categoryText: {
    color: 'white',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  movieList: {
    flexGrow: 1,
    marginTop: 12,
  },
  movieItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  movieTitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  noResults: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default CategorySearch;
