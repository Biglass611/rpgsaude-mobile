import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config'; // Importa a URL do seu config

// --- Definição do Tipo (Local) ---
interface RankingDTO {
  nomeAvatar: string;
  nivel: number;
  moedas: number;
}

export default function LeaderboardScreen() {
  const route = useRoute<any>();
  // Recebe os parâmetros passados pela navegação
  const { desafioId, nomeGrupo } = route.params || { desafioId: 0, nomeGrupo: 'Grupo' };

  const [ranking, setRanking] = useState<RankingDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (desafioId) {
      carregarRanking();
    } else {
      Alert.alert("Erro", "ID do grupo inválido.");
      setLoading(false);
    }
  }, []);

  const carregarRanking = async () => {
    try {
      const token = await AsyncStorage.getItem('@rpgsaude_token');
      
      // Chama a API direto aqui
      const response = await axios.get<RankingDTO[]>(`${API_URL}/api/dungeon/ranking/${desafioId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRanking(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o ranking.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: RankingDTO, index: number }) => {
    // Medalhas para os 3 primeiros
    let medalha = "";
    let corPosicao = "#bdc3c7"; // Cinza padrão

    if (index === 0) { medalha = "🥇"; corPosicao = "#f1c40f"; } // Ouro
    else if (index === 1) { medalha = "🥈"; corPosicao = "#bdc3c7"; } // Prata
    else if (index === 2) { medalha = "🥉"; corPosicao = "#d35400"; } // Bronze
    else { medalha = `${index + 1}º`; }

    return (
      <View style={styles.card}>
        <View style={styles.posicao}>
            <Text style={[styles.textoPosicao, { color: index < 3 ? '#fff' : corPosicao }]}>
              {medalha}
            </Text>
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

      {loading ? <ActivityIndicator color="#f1c40f" size="large" style={{marginTop: 50}} /> : (
        <FlatList
          data={ranking}
          keyExtractor={(item, index) => item.nomeAvatar + index}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={<Text style={styles.vazio}>Ninguém neste grupo ainda.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2c3e50', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#ecf0f1', textAlign: 'center', marginTop: 10 },
  subtitulo: { fontSize: 16, color: '#f1c40f', textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  
  lista: { paddingBottom: 20 },
  vazio: { color: '#95a5a6', textAlign: 'center', marginTop: 50 },

  card: { 
    flexDirection: 'row', 
    backgroundColor: '#34495e', 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 10, 
    alignItems: 'center',
    elevation: 2 
  },
  
  posicao: { width: 50, alignItems: 'center', marginRight: 10 },
  textoPosicao: { fontSize: 20, fontWeight: 'bold' },
  
  info: { flex: 1 },
  nome: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  stats: { fontSize: 14, color: '#bdc3c7', marginTop: 4 }
});