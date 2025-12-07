import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Share } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

export default function CriarDesafioScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('Geral');
  const [loading, setLoading] = useState(false);

  const handleCriar = async () => {
    if (!nome || !descricao) {
      Alert.alert("Atenção", "Dê um nome e uma descrição para o seu grupo.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@rpgsaude_token');
      
      const response = await axios.post(`${API_URL}/api/desafio/criar`, {
        nome: nome,
        descricao: descricao,
        tipo: tipo,
        chefeId: 1,      
        recompensaId: 1 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const novoId = response.data.id;

      Alert.alert(
        "Grupo Criado com Sucesso! 🎉",
        `O código de acesso é: ${novoId}\nEnvie para seus amigos entrarem.`,
        [
          { text: "Compartilhar Código", onPress: () => compartilhar(novoId, nome) },
          { text: "Voltar", onPress: () => navigation.goBack() }
        ]
      );

    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o grupo agora.");
    } finally {
      setLoading(false);
    }
  };

  const compartilhar = async (id: number, nomeGrupo: string) => {
    try {
      await Share.share({
        message: `Bora participar do grupo "${nomeGrupo}" no RPG Saúde! \nUse o código de acesso: ${id}`,
      });
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Novo Grupo 🛡️</Text>
      
      <Text style={styles.label}>Nome do Grupo (Ex: Corrida Matinal)</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Digite o nome..." />

      <Text style={styles.label}>Descrição da Atividade</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Ex: Correr 5km no parque..." />

      <Text style={styles.label}>Categoria</Text>
      <TextInput style={styles.input} value={tipo} onChangeText={setTipo} placeholder="Ex: Cardio, Força, Meditação..." />

      <TouchableOpacity style={styles.btn} onPress={handleCriar} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>CRIAR GRUPO</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f6fa', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#2c3e50' },
  label: { fontWeight: 'bold', color: '#34495e', marginBottom: 8, fontSize: 16 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#dcdde1', fontSize: 16 },
  btn: { backgroundColor: '#27ae60', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10, shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity: 0.2, elevation: 3 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});