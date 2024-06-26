import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_ACCESS_TOKEN } from '@env';

const categories = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];

const CategorySearch = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const navigation = useNavigation();

  useEffect(() => {
    if (selectedCategory) {
      fetchMoviesByCategory(selectedCategory);
    }
  }, [selectedCategory]);

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
      navigation.navigate('MovieDetail', { id: data.results[0].id }); // Navigate to the first result
    } catch (error) {
      console.error(`Error fetching movies in category ${category}:`, error);
      Alert.alert('Error', 'Failed to fetch movies');
    }
  };

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
    <View style={styles.container}>
      <Text style={styles.label}>Select a category:</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
});

export default CategorySearch;
