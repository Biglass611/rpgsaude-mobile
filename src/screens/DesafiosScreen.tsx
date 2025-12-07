import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { useNavigation } from '@react-navigation/native';

export default function DesafiosScreen() {
 const navigation = useNavigation<any>();
 const [desafios, setDesafios] = useState<any[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDesafios();
  }, []);

  const carregarDesafios = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@rpgsaude_token');
      const response = await axios.get(`${API_URL}/api/desafio/listar`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDesafios(response.data);
    } catch (e) { Alert.alert('Erro', 'Falha ao listar grupos.'); }
    finally { setLoading(false); }
  };

 const entrarGrupo = async (desafioId: number, nomeDesafio: string) => {
    try {
      const token = await AsyncStorage.getItem('@rpgsaude_token');
      
      // 1. Pega ID do usuário
      const avatarRes = await axios.get(`${API_URL}/api/avatar/listar`, { headers: { Authorization: `Bearer ${token}` } });
      const usuarioId = avatarRes.data[0]?.usuarioId;

      if(!usuarioId) {
         Alert.alert("Erro", "Perfil de usuário não encontrado.");
         return;
      }

      // 2. Cria a participação (Dungeon) com o NOME DO DESAFIO
      await axios.post(`${API_URL}/api/dungeon/criar`, {
        nome: nomeDesafio || "Atividade em Grupo", // Usa o nome real do desafio
        dificuldade: 1, 
        status: 1, // 1 = Em andamento
        usuarioId: usuarioId,
        desafioId: desafioId
      }, { headers: { Authorization: `Bearer ${token}` } });

      Alert.alert(
          'Sucesso!', 
          `Você entrou no grupo "${nomeDesafio}".`, 
          [{ text: 'Ver Minhas Atividades', onPress: () => navigation.navigate('MinhaDungeon') }]
      );
    } catch (e) { 
        console.log(e);
        Alert.alert('Erro', 'Você provavelmente já está neste grupo ou houve um erro de conexão.'); 
    }
  };

  const buscarPorId = () => {
      // Lógica simples: Procura na lista local ou avisa se não achar
      const id = parseInt(searchCode);
      const achou = desafios.find((d: any) => d.id === id);
      
      if (achou) {
          Alert.alert("Grupo Encontrado", `Deseja entrar em: ${achou.nome}?`, [
              { text: "Cancelar" },
              { text: "Entrar", onPress: () => entrarGrupo(achou.id, achou.nome) }
          ]);
      } else {
          Alert.alert("Não encontrado", "Nenhum grupo com este código foi encontrado na lista pública.");
      }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Encontrar Grupos 🔍</Text>
      
      {/* Área de Busca por ID */}
      <View style={styles.searchContainer}>
        <TextInput 
            style={styles.input} 
            placeholder="Digite o Código do Grupo" 
            keyboardType="numeric" 
            value={searchCode} 
            onChangeText={setSearchCode} 
        />
        <TouchableOpacity style={styles.btnBuscar} onPress={buscarPorId}>
            <Text style={{color:'#fff', fontWeight: 'bold'}}>BUSCAR</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeader}>Grupos Públicos Disponíveis:</Text>

      <FlatList 
        data={desafios}
        keyExtractor={(item: any) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregarDesafios}/>}
        renderItem={({item}) => (
          <View style={styles.card}>
             <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                <Text style={styles.cardId}>#{item.id}</Text>
             </View>
             <Text style={styles.cardDesc}>{item.descricao}</Text>
             <Text style={styles.cardType}>Categoria: {item.tipo}</Text>
             
             <TouchableOpacity style={styles.btnEntrar} onPress={() => entrarGrupo(item.id, item.nome)}>
                <Text style={styles.btnText}>PARTICIPAR</Text>
             </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f6fa' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50', marginTop: 20 },
  subHeader: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#7f8c8d' },
  searchContainer: { flexDirection:'row', marginBottom: 25 },
  input: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor:'#ddd', borderRadius: 8, padding: 12, marginRight: 10 },
  btnBuscar: { backgroundColor: '#34495e', padding: 12, borderRadius: 8, justifyContent:'center', paddingHorizontal: 20 },
  
  card: { backgroundColor: '#fff', padding: 20, marginBottom: 15, borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  cardId: { fontSize: 14, color: '#bdc3c7', fontWeight: 'bold' },
  cardDesc: { color: '#7f8c8d', marginBottom: 10, fontSize: 14 },
  cardType: { color: '#2980b9', fontSize: 12, fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase' },
  
  btnEntrar: { backgroundColor: '#3498db', padding: 12, borderRadius: 8, alignItems:'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});