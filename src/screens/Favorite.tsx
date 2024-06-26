import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const FavoriteScreen = (): JSX.Element => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchFavorites();
  }, []);

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

  const navigateToMovieDetail = (movieId: number) => {
    navigation.navigate('MovieDetail', { id: movieId });
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
          horizontal
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
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 10,
  },
  movieTitle: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  noFavorites: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default FavoriteScreen;
