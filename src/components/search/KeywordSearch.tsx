import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, FlatList, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_ACCESS_TOKEN } from '@env';

const KeywordSearch = (): JSX.Element => {
  const [keyword, setKeyword] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // State untuk mengelola status loading
  const [showNoResults, setShowNoResults] = useState<boolean>(false); // State untuk menampilkan pesan "No results found"
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (!keyword.trim()) {
      Alert.alert('Error', 'Kata kunci tidak boleh kosong');
      return;
    }

    setIsLoading(true); // Set state loading menjadi true sebelum fetching data

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(keyword)}&language=id-ID&page=1&include_adult=false`;
    const options = {
      headers: {
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        Accept: 'application/json',
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log('Hasil pencarian:', data.results);

      if (data.results.length > 0) {
        setResults(data.results);
        setShowNoResults(false); // Sembunyikan pesan "No results found" jika hasil ditemukan
      } else {
        setResults([]); // Kosongkan hasil jika tidak ada hasil ditemukan
        setShowNoResults(true); // Tampilkan pesan "No results found"
      }
    } catch (error) {
      console.error('Error fetching movies by keyword:', error);
      Alert.alert('Error', 'Gagal mengambil data film');
    } finally {
      setIsLoading(false); // Set state loading menjadi false setelah fetching data selesai
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
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Cari berdasarkan kata kunci"
          value={keyword}
          onChangeText={(text) => setKeyword(text)}
          onSubmitEditing={handleSearch}
        />
        <Button title="Cari" onPress={handleSearch} />
      </View>

      {isLoading ? ( // Tampilkan indikator loading saat fetching data
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        results.length > 0 ? ( // Tampilkan hasil jika ada hasil
          <FlatList
            data={results}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.movieList}
          />
        ) : showNoResults ? ( // Tampilkan pesan "No results found" jika tidak ada hasil dan showNoResults true
          <Text style={styles.noResults}>Tidak ditemukan hasil untuk kata kunci ini.</Text>
        ) : null // Tidak menampilkan apapun jika masih menunggu hasil pencarian
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  searchContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  movieList: {
    flexGrow: 1,
  },
  movieItem: {
    marginBottom: 16,
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
  noResults: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default KeywordSearch;
