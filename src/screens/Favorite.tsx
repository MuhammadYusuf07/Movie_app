import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const FavoriteScreen = (): JSX.Element => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const navigation = useNavigation();

  const fetchFavorites = async () => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      if (initialData) {
        setFavorites(JSON.parse(initialData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const navigateToMovieDetail = (movieId: number) => {
    navigation.navigate('MovieDetail', { id: movieId });
  };

  const removeFavorite = async (movieId: number) => {
    try {
      const updatedFavorites = favorites.filter(item => item.id !== movieId);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.log(error);
    }
  };

  const renderMovieItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigateToMovieDetail(item.id)}>
      <View style={styles.movieItem}>
        <Image
          style={styles.poster}
          source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
          resizeMode="cover"
        />
        <Text style={styles.movieTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Favorite Movies</Text>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal={windowWidth > 600} // Horizontal on larger screens
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.movieList}
        />
      ) : (
        <Text style={styles.noFavorites}>No favorite movies yet.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  movieList: {
    alignItems: 'center',
  },
  movieItem: {
    marginRight: 16,
    alignItems: 'center',
    width: 200, // Adjust item width as needed
  },
  poster: {
    width: '100%', // Full width
    height: 300,
    borderRadius: 10,
  },
  movieTitle: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    width: '100%', // Full width
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
  },
  noFavorites: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default FavoriteScreen;
