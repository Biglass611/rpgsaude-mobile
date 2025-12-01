import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { listarDesafios, entrarNaDungeon } from '../services/desafioService';
import { getMeusAvatares } from '../services/avatarService';
import { DesafioDTO } from '../types/desafio';
import { useNavigation } from '@react-navigation/native';

export default function DesafiosScreen() {
  const navigation = useNavigation<any>();
  const [desafios, setDesafios] = useState<DesafioDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [searchCode, setSearchCode] = useState(''); // NOVO ESTADO PARA O CÓDIGO DE BUSCA

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const listaDesafios = await listarDesafios();
      setDesafios(listaDesafios);

      const avatares = await getMeusAvatares();
      if (avatares.length > 0) {
         setUsuarioId(avatares[0].usuarioId); 
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as missões.');
    } finally {
      setLoading(false);
    }
  };
  
  // --- NOVA LÓGICA DE ENTRADA POR CÓDIGO ---
  const handleJoinByCode = async () => {
    const desafioId = parseInt(searchCode, 10);
    
    if (isNaN(desafioId) || desafioId <= 0) {
        Alert.alert('Erro', 'Insira um código de desafio válido.');
        return;
    }
    if (!usuarioId) {
        Alert.alert('Erro', 'Usuário não identificado.');
        return;
    }
    
    // Tenta entrar na Dungeon diretamente com o ID digitado
    try {
        await entrarNaDungeon(desafioId, usuarioId);

        Alert.alert('Sucesso!', `Você entrou no grupo de código #${desafioId}`, [
            { text: 'VER MINHAS MISSÕES', onPress: () => navigation.navigate('MinhaDungeon') }
        ]);

    } catch (error) {
         Alert.alert('Erro', 'Não foi possível encontrar ou entrar no grupo.');
    }
  };
  // ----------------------------------------


  const handleParticipar = async (desafio: DesafioDTO) => {
    if (!usuarioId) {
        Alert.alert('Erro', 'Usuário não identificado.');
        return;
    }

    try {
        await entrarNaDungeon(desafio.id, usuarioId);
        
        Alert.alert('Missão Aceita! ⚔️', `Você entrou no desafio: ${desafio.nome}`, [
            { 
              text: 'VER MINHAS MISSÕES', 
              onPress: () => navigation.navigate('MinhaDungeon') 
            } 
        ]);
        
    } catch (error) {
        Alert.alert('Erro', 'Não foi possível aceitar a missão. Talvez você já esteja nela?');
    }
  };

  const renderItem = ({ item }: { item: DesafioDTO }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.idBadge}>#{item.id}</Text> 
        <Text style={styles.tipo}>{item.tipo}</Text>
      </View>
      
      <Text style={styles.titulo}>{item.nome}</Text>
      <Text style={styles.descricao}>{item.descricao}</Text>
      
      {item.nomeRecompensa && <Text style={styles.recompensa}>🏆 Prêmio: {item.nomeRecompensa}</Text>}
      
      <TouchableOpacity style={styles.botaoAceitar} onPress={() => handleParticipar(item)}>
        <Text style={styles.textoBotao}>ENTRAR NO GRUPO</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Quadro de Missões 📜</Text>
      
      {/* NOVO CAMPO DE BUSCA */}
      <View style={styles.searchContainer}>
        <TextInput
            style={styles.searchInput}
            placeholder="Digite o código do grupo (ID)"
            keyboardType="numeric"
            value={searchCode}
            onChangeText={setSearchCode}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleJoinByCode}>
            <Text style={styles.searchButtonText}>ENTRAR</Text>
        </TouchableOpacity>
      </View>
      {/* FIM CAMPO DE BUSCA */}

      {loading ? (
        <ActivityIndicator size="large" color="#8e44ad" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={desafios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhuma missão disponível no momento.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ecf0f1', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 20, textAlign: 'center' },
  list: { paddingBottom: 20 },
  empty: { textAlign: 'center', color: '#7f8c8d', marginTop: 50, fontSize: 16 },
  
  // ESTILOS NOVOS PARA BUSCA
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    marginRight: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // ESTILOS ANTIGOS
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10, alignItems: 'center' },
  tipo: { backgroundColor: '#3498db', color: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontWeight: 'bold', overflow: 'hidden', marginRight: 10 },
  recompensa: { color: '#e67e22', fontWeight: 'bold', fontSize: 12 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  descricao: { fontSize: 14, color: '#7f8c8d', marginBottom: 15 },
  botaoAceitar: { backgroundColor: '#8e44ad', padding: 12, borderRadius: 8, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  idBadge: { 
    backgroundColor: '#2c3e50', 
    color: '#fff', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4, 
    fontSize: 12, 
    fontWeight: 'bold', 
    marginRight: 10 
  },
});