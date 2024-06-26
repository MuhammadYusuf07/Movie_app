import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_ACCESS_TOKEN } from '@env';

const KeywordSearch = (): JSX.Element => {
  const [keyword, setKeyword] = useState<string>('');
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (!keyword.trim()) {
      Alert.alert('Error', 'Keyword cannot be empty');
      return;
    }

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(keyword)}&language=en-US&page=1&include_adult=false`;
    const options = {
      headers: {
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        Accept: 'application/json',
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log('Search results:', data.results);
      navigation.navigate('MovieDetail', { id: data.results[0].id }); // Navigate to the first result
    } catch (error) {
      console.error('Error fetching movies by keyword:', error);
      Alert.alert('Error', 'Failed to fetch movies');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by keyword"
        value={keyword}
        onChangeText={(text) => setKeyword(text)}
        onSubmitEditing={handleSearch}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default KeywordSearch;
