import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';
import { useNavigation } from '@react-navigation/native';

export default function DesafiosScreen() {
  const navigation = useNavigation<any>();
  const [desafios, setDesafios] = useState([]);
  const [searchCode, setSearchCode] = useState('');

  useEffect(() => {
    carregarDesafios();
  }, []);

  const carregarDesafios = async () => {
    try {
      const token = await AsyncStorage.getItem('@rpgsaude_token');
      const response = await axios.get(`${API_URL}/api/desafio/listar`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDesafios(response.data);
    } catch (e) { Alert.alert('Erro', 'Falha ao listar'); }
  };

  const entrarGrupo = async (desafioId: number) => {
    try {
      const token = await AsyncStorage.getItem('@rpgsaude_token');
      
      // Precisamos do ID do usuario. Vamos pegar do avatar rapidinho
      const avatarRes = await axios.get(`${API_URL}/api/avatar/listar`, { headers: { Authorization: `Bearer ${token}` } });
      const usuarioId = avatarRes.data[0].usuarioId;

      await axios.post(`${API_URL}/api/dungeon/criar`, {
        nome: "Minha Dungeon", 
        dificuldade: 1, 
        status: 1,
        usuarioId: usuarioId,
        desafioId: desafioId
      }, { headers: { Authorization: `Bearer ${token}` } });

      Alert.alert('Sucesso', 'Você entrou no grupo!', [{ text: 'Ver Missões', onPress: () => navigation.navigate('MinhaDungeon') }]);
    } catch (e) { Alert.alert('Erro', 'Não foi possível entrar.'); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Procurar Grupo</Text>
      
      <View style={{flexDirection:'row', marginBottom:20}}>
        <TextInput style={styles.input} placeholder="Digite o Código ID" keyboardType="numeric" value={searchCode} onChangeText={setSearchCode} />
        <TouchableOpacity style={styles.btnBuscar} onPress={() => entrarGrupo(parseInt(searchCode))}>
            <Text style={{color:'#fff'}}>ENTRAR</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={desafios}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
             <Text style={{fontWeight:'bold'}}>#{item.id} - {item.nome}</Text>
             <Text>{item.descricao}</Text>
             <TouchableOpacity style={styles.btnEntrar} onPress={() => entrarGrupo(item.id)}>
                <Text style={{color:'#fff'}}>ENTRAR</Text>
             </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor:'#ccc', borderRadius: 5, padding: 10, marginRight: 10 },
  btnBuscar: { backgroundColor: '#27ae60', padding: 12, borderRadius: 5, justifyContent:'center' },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
  btnEntrar: { backgroundColor: '#3498db', padding: 10, borderRadius: 5, marginTop: 10, alignItems:'center' }
});