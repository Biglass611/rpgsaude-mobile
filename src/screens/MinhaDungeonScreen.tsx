import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { listarDungeons, concluirDungeon} from '../services/dungeonService';
import { getMeusAvatares } from '../services/avatarService';
import { DungeonDTO } from '../types/dungeon';
import { useNavigation } from '@react-navigation/native';

export default function MinhaDungeonScreen() {
  const navigation = useNavigation<any>();
  const [dungeons, setDungeons] = useState<DungeonDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      setLoading(true);
      const avatares = await getMeusAvatares();
      const meuEmail = avatares[0]?.nomeUsuario;

      const lista = await listarDungeons();
      
      // Filtra apenas as Dungeons deste usuário
      if (meuEmail) {
          const minhas = lista.filter(d => d.nomeUsuario === meuEmail);
          setDungeons(minhas);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar suas missões.');
    } finally {
      setLoading(false);
    }
  };

  const handleConcluir = async (id: number) => {
      try {
        await concluirDungeon(id); 
        Alert.alert("Parabéns! 🎉", "Missão cumprida! A dungeon foi finalizada.");
        carregar(); 
      } catch (e) {
          Alert.alert("Erro", "Não foi possível concluir.");
      }
  };

  const abrirRanking = (dungeon: DungeonDTO) => {
      // Só abre o ranking se tivermos o ID do desafio.
      // Se o seu backend ainda não manda o desafioId no DTO, vai dar undefined.
      // Mas vamos deixar preparado.
      if(dungeon.desafioId) {
        navigation.navigate('Leaderboard', { 
            desafioId: dungeon.desafioId, 
            nomeGrupo: dungeon.nomeDesafio 
        });
      } else {
          Alert.alert("Aviso", "Dados de ranking indisponíveis para esta missão.");
      }
  };

  const renderItem = ({ item }: { item: DungeonDTO }) => (
    <TouchableOpacity style={styles.card} onPress={() => abrirRanking(item)} activeOpacity={0.9}>
      <Text style={styles.titulo}>{item.nome}</Text>
      <Text style={styles.subtitulo}>Desafio: {item.nomeDesafio}</Text>
      
      <View style={styles.statusContainer}>
          <Text style={styles.status}>Em andamento ⏳</Text>
      </View>

      <View style={styles.footer}>
         <Text style={styles.cliqueAviso}>🏆 Toque para ver o Ranking</Text>
         
         <TouchableOpacity style={styles.btnConcluir} onPress={() => handleConcluir(item.id)}>
            <Text style={styles.btnText}>✅ CONCLUIR</Text>
         </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Minhas Dungeons Ativas 🏰</Text>
      {loading ? <ActivityIndicator color="#8e44ad" size="large" /> : (
        <FlatList
            data={dungeons}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>Você não tem Dungeons ativas.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#ecf0f1' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50', textAlign: 'center' },
  list: { paddingBottom: 20 },
  
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#34495e' },
  subtitulo: { fontSize: 14, color: '#7f8c8d', marginBottom: 10 },
  
  statusContainer: { alignSelf: 'flex-start', backgroundColor: '#f1c40f', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 15 },
  status: { fontSize: 12, color: '#fff', fontWeight: 'bold' },
  
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  cliqueAviso: { fontSize: 12, color: '#3498db', fontStyle: 'italic' },
  
  btnConcluir: { backgroundColor: '#27ae60', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  
  empty: { textAlign: 'center', color: '#95a5a6', marginTop: 50, fontSize: 16 }
});