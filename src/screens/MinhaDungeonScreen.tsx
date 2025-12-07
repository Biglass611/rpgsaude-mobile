import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { API_URL } from '../config';

export default function MinhaDungeonScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused(); 
  const [minhasAtividades, setMinhasAtividades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
        carregar();
    }
  }, [isFocused]);

  const carregar = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('@rpgsaude_token');
      
      // 1. Pega o nome de usuário salvo no Login
      const meuLogin = await AsyncStorage.getItem('@rpgsaude_usuario_login');

      console.log("--- FILTRO ---");
      console.log("Filtrando lista para o usuário:", meuLogin);

      if (!meuLogin) {
          Alert.alert("Aviso", "Faça login novamente para carregar suas missões.");
          setLoading(false);
          return;
      }

      // 2. Busca TODAS as dungeons
      const listaRes = await axios.get(`${API_URL}/api/dungeon/listar`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      
      // 3. Filtra comparando o Login com o nomeUsuario da Dungeon
      const minhas = listaRes.data.filter((d: any) => {
          // Verifica se o nomeUsuario da missão contém o login ou é igual
          // (Usamos toLowerCase para evitar erro de maiúscula/minúscula)
          const usuarioDaMissao = d.nomeUsuario || "";
          return usuarioDaMissao.toLowerCase() === meuLogin.toLowerCase();
      });
      
      console.log(`Encontrados: ${minhas.length} missões.`);

      minhas.sort((a: any, b: any) => a.status - b.status); 
      setMinhasAtividades(minhas); 

    } catch (error) {
      console.log("Erro ao carregar:", error);
      Alert.alert('Erro', 'Não foi possível carregar.');
    } finally {
      setLoading(false);
    }
  };

  const handleConcluir = async (atividade: any) => {
    if (atividade.status === 2) return; 

    Alert.alert(
        "Confirmar Conclusão", 
        "Você completou esta atividade?",
        [
            { text: "Não" },
            { text: "Sim", onPress: async () => {
                try {
                    const token = await AsyncStorage.getItem('@rpgsaude_token');
                    
                    // PASSO 1: Busca o ID numérico do usuário (Avatar) para garantir a permissão
                    // Isso é necessário porque a lista de dungeons as vezes não traz esse ID
                    const avatarRes = await axios.get(`${API_URL}/api/avatar/listar`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    const meuIdNumerico = avatarRes.data[0]?.usuarioId;

                    if (!meuIdNumerico) {
                        Alert.alert("Erro", "Não foi possível identificar seu usuário para validar a ação.");
                        return;
                    }

                    // PASSO 2: Monta o objeto completo com o ID que faltava
                    const payload = {
                        id: atividade.id,
                        nome: atividade.nome,
                        dificuldade: atividade.dificuldade,
                        status: 2, 
                        usuarioId: meuIdNumerico, 
                        desafioId: atividade.desafioId,
                        nomeUsuario: atividade.nomeUsuario 
                    };

                    console.log("Enviando Payload Completo:", JSON.stringify(payload));

                    await axios.put(`${API_URL}/api/dungeon/atualizar/${atividade.id}`, payload, { 
                        headers: { Authorization: `Bearer ${token}` } 
                    });
                    
                    Alert.alert("Parabéns!", "Missão concluída com sucesso! 🎉");
                    carregar(); // Atualiza a lista visualmente
                } catch (e: any) {
                    console.log("Erro ao atualizar:", e.response?.data || e.message);
                    Alert.alert("Erro", "O servidor não aceitou a conclusão. Tente novamente.");
                }
            }}
        ]
    );
  };
  const renderItem = ({ item }: { item: any }) => {
      const isConcluido = item.status === 2;
      return (
        <TouchableOpacity 
            style={[styles.card, isConcluido ? styles.cardConcluido : styles.cardPendente]} 
            onPress={() => handleConcluir(item)}
            disabled={isConcluido}
        >
           <View style={{flex: 1}}>
               <Text style={[styles.titulo, isConcluido && styles.textConcluido]}>{item.nome}</Text>
               <Text style={styles.subtitulo}>{isConcluido ? "Concluído ✅" : "Pendente ⏳"}</Text>
               <Text style={{fontSize: 10, color: '#bdc3c7'}}>ID: {item.id} | Grupo: {item.nomeUsuario}</Text>
           </View>
           <View style={[styles.indicador, { backgroundColor: isConcluido ? '#27ae60' : '#f1c40f' }]} />
        </TouchableOpacity>
      )
  }
  
  return (
     <View style={styles.container}>
        <Text style={styles.header}>Minhas Atividades 📋</Text>
        <FlatList 
            data={minhasAtividades} 
            renderItem={renderItem} 
            keyExtractor={(item) => item.id.toString()}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} />}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma missão encontrada para "{minhasAtividades.length === 0 ? 'você' : ''}".</Text>}
        />
     </View>
  )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f6fa' },
    header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50', marginTop: 20 },
    card: { flexDirection: 'row', padding: 20, marginBottom: 12, borderRadius: 12, elevation: 2, justifyContent: 'space-between', overflow: 'hidden' },
    cardPendente: { backgroundColor: '#fff' },
    cardConcluido: { backgroundColor: '#ecf0f1', opacity: 0.8 },
    titulo: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
    subtitulo: { fontSize: 14, color: '#7f8c8d' },
    textConcluido: { textDecorationLine: 'line-through', color: '#95a5a6' },
    indicador: { width: 8, height: '200%', position: 'absolute', right: 0, top: -10 },
    emptyText: { textAlign: 'center', color: '#95a5a6', fontSize: 16, marginTop: 50 }
});