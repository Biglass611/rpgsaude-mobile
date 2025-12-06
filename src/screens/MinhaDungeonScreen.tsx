import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from './config';

export default function MinhaDungeonScreen() {
  const navigation = useNavigation<any>();
  const [dungeons, setDungeons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('@rpgsaude_token');
      
      // 1. Pega o email do usuário (Avatar)
      const avatarRes = await axios.get(`${API_URL}/api/avatar/listar`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      const meuEmail = avatarRes.data[0]?.nomeUsuario;

      // 2. Busca todas as dungeons
      const listaRes = await axios.get(`${API_URL}/api/dungeon/listar`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      
      // 3. Filtra
      if (meuEmail) {
          const minhas = listaRes.data.filter((d: any) => d.nomeUsuario === meuEmail);
          setDungeons(minhas); 
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar suas missões.');
    } finally {
      setLoading(false);
    }
  };

  const handleConcluir = async (dungeon: any) => {
    if (dungeon.status === 2) return;

    try {
        const token = await AsyncStorage.getItem('@rpgsaude_token');
        await axios.put(`${API_URL}/api/dungeon/atualizar/${dungeon.id}`, {
            nome: dungeon.nome,
            dificuldade: dungeon.dificuldade,
            status: 2, // Concluída
            usuarioId: dungeon.usuarioId, 
            desafioId: dungeon.desafioId,
        }, { headers: { Authorization: `Bearer ${token}` } });
        
        Alert.alert("Parabéns!", "Missão concluída.");
        carregar(); 
    } catch (e) {
        Alert.alert("Erro", "Não foi possível concluir.");
    }
  };

  // ... (RenderItem e Return iguais ao anterior, só mudando a tipagem para 'any' se precisar)
  // ... Mantenha o restante do código visual
  const renderItem = ({ item }: { item: any }) => {
      // ... (mesma lógica visual)
      return (
        <TouchableOpacity style={styles.card} /* ... */>
           {/* ... */}
        </TouchableOpacity>
      )
  }
  
  return (
     <View style={styles.container}>
        {/* ... */}
        <FlatList data={dungeons} renderItem={renderItem} />
     </View>
  )
}

const styles = StyleSheet.create({
    // ... (copie os estilos anteriores)
    container: { flex: 1, padding: 20, backgroundColor: '#ecf0f1' },
    // ...
    card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8 },
    // ...
});