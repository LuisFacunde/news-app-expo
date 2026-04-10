import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import News from './src/components/News';

import { fetchNewsService, NewsData } from './src/utils/handle-api';

export default function App() {
  const [newsList, setNewsList] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    const totalItens = newsList.flat().length; 

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await fetchNewsService();
      setNewsList(data);
    } catch (err: any) {
      setError(err.message || "Erro ao obter notícias");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Image style={styles.iconHeader} source={require("./assets/newspaper-banner.png")}/>
        <Text style={styles.headerTitle}>Últimas notícias</Text>
        <TouchableOpacity style={styles.updatePage} onPress={() => fetchNews()}>
          Atualizar Página
        </TouchableOpacity>

      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Carregando notícias...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erro: {error}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View>
            <Text style={styles.qtNews}> 
              {totalItens} Novas notícias
            </Text>
          </View>
          {newsList.map((item) => (
            <News
              key={item.id.toString()}
              title={item.title}
              image={item.image}
              published={item.published}
              link={item.link}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
    paddingTop: 40, // Ensure header is spaced from exact top
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  iconHeader: {
    width: 60,
    height: 60,
    marginBottom: 10
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
  },
  updatePage: {
    fontSize: 13,
    color: "gray",
    marginTop: 5,
    borderBottomColor: "gray"
  },
  qtNews: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 600
  }
});
