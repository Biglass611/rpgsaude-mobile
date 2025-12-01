import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Share } from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function CriarDesafioScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('Geral');

  const handleCriar = async () => {
    if (!nome || !descricao) {
      Alert.alert("Erro", "Preencha o nome e a descrição do grupo.");
      return;
    }

    try {
      // Envia para o backend. Usamos recompensaId: 1 e chefeId: 1 fixos por enquanto
      // para não complicar a criação (já que é um MVP).
      const response = await api.post('/api/desafio/criar', {
        nome: nome,
        descricao: descricao,
        tipo: tipo,
        chefeId: 1,      
        recompensaId: 1 
      });

      const novoId = response.data.id;

      Alert.alert(
        "Grupo Criado! 🎉",
        `O código do seu grupo é: ${novoId}\nCompartilhe com seus amigos!`,
        [
          { text: "Compartilhar", onPress: () => compartilhar(novoId, nome) },
          { text: "OK", onPress: () => navigation.goBack() }
        ]
      );

    } catch (error) {
      Alert.alert("Erro", "Falha ao criar o grupo.");
    }
  };

  const compartilhar = async (id: number, nomeGrupo: string) => {
    try {
      await Share.share({
        message: `Venha participar do meu grupo "${nomeGrupo}" no RPG Saúde! \nUse o código: ${id}`,
      });
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Novo Grupo 🛡️</Text>
      
      <Text style={styles.label}>Nome do Grupo/Desafio</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Caminhada Matinal" />

      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Ex: Andar 5km todo dia" />

      <Text style={styles.label}>Categoria</Text>
      <TextInput style={styles.input} value={tipo} onChangeText={setTipo} placeholder="Ex: Cardio" />

      <TouchableOpacity style={styles.btn} onPress={handleCriar}>
        <Text style={styles.btnText}>CRIAR E OBTER CÓDIGO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ecf0f1', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#2c3e50' },
  label: { fontWeight: 'bold', color: '#34495e', marginBottom: 5 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  btn: { backgroundColor: '#27ae60', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});