import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getRanking } from '../services/dungeonService';
import { RankingDTO } from '../types/ranking';
import { useRoute } from '@react-navigation/native';

export default function LeaderboardScreen() {
  const route = useRoute<any>();
  const { desafioId, nomeGrupo } = route.params; // Recebe os dados da tela anterior

  const [ranking, setRanking] = useState<RankingDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarRanking();
  }, []);

  const carregarRanking = async () => {
    try {
      const lista = await getRanking(desafioId);
      setRanking(lista);
    } catch (error) {
      console.log("Erro no ranking");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: RankingDTO, index: number }) => {
    // Define cor para 1º, 2º e 3º lugar
    let medalha = "";
    if (index === 0) medalha = "🥇";
    else if (index === 1) medalha = "🥈";
    else if (index === 2) medalha = "🥉";
    else medalha = `${index + 1}º`;

    return (
      <View style={styles.card}>
        <View style={styles.posicao}>
            <Text style={styles.medalha}>{medalha}</Text>
        </View>
        <View style={styles.info}>
            <Text style={styles.nome}>{item.nomeAvatar}</Text>
            <Text style={styles.stats}>Nível {item.nivel} • 💰 {item.moedas}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{nomeGrupo}</Text>
      <Text style={styles.subtitulo}>🏆 Leaderboard 🏆</Text>

      {loading ? <ActivityIndicator color="#f1c40f" size="large" /> : (
        <FlatList
          data={ranking}
          keyExtractor={(item) => item.nomeAvatar}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2c3e50', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#ecf0f1', textAlign: 'center', marginTop: 20 },
  subtitulo: { fontSize: 16, color: '#f1c40f', textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  lista: { paddingBottom: 20 },
  card: { flexDirection: 'row', backgroundColor: '#34495e', borderRadius: 10, padding: 15, marginBottom: 10, alignItems: 'center' },
  posicao: { width: 40, alignItems: 'center', marginRight: 10 },
  medalha: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  info: { flex: 1 },
  nome: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  stats: { fontSize: 14, color: '#bdc3c7' }
});