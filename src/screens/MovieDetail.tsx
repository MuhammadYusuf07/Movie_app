import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { API_ACCESS_TOKEN } from '@env';

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params;
  const [movieDetails, setMovieDetails] = useState<any>({});
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchMovieDetails();
    fetchRecommendations();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      checkIsFavorite(id);
    }, [id])
  );

  const fetchMovieDetails = async () => {
    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
    const options = {
      headers: {
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        Accept: 'application/json',
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setMovieDetails(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const fetchRecommendations = async () => {
    const url = `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`;
    const options = {
      headers: {
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        Accept: 'application/json',
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setRecommendations(data.results);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const addFavorite = async (movie: any): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      let favMovieList: any[] = initialData ? JSON.parse(initialData) : [];
      favMovieList.push(movie);
      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
      setIsFavorite(true);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      let favMovieList: any[] = initialData ? JSON.parse(initialData) : [];
      favMovieList = favMovieList.filter((movie: any) => movie.id !== id);
      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
      setIsFavorite(false);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      await removeFavorite(movieDetails.id);
    } else {
      await addFavorite(movieDetails);
    }
  };

  const checkIsFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      if (initialData) {
        const favMovieList: any[] = JSON.parse(initialData);
        const isFav = favMovieList.some((movie: any) => movie.id === id);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToMovieDetail = (movieId: number) => {
    console.log(`Navigating to movie with ID: ${movieId}`);
    navigation.navigate('MovieDetail', { id: movieId });
  };

  return (
    <ScrollView style={styles.container}>
      {movieDetails.poster_path && (
        <Image
          style={styles.poster}
          source={{ uri: `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}` }}
          resizeMode="cover"
        />
      )}
      <View style={styles.header}>
        <Text style={styles.title}>{movieDetails.title}</Text>
        <TouchableOpacity onPress={toggleFavorite}>
          <FontAwesome
            name={isFavorite ? 'heart' : 'heart-o'}
            size={30}
            color={isFavorite ? 'red' : 'black'}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.overview}>{movieDetails.overview}</Text>
      <Text style={styles.sectionTitle}>Recommendations</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.recommendationListContainer}
      >
        {recommendations.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigateToMovieDetail(item.id)}
          >
            <Image
              style={styles.recommendationPoster}
              source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  poster: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  overview: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recommendationListContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  recommendationPoster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 8,
  },
});

export default MovieDetail;
