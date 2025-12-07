import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config'

export default function CreateAvatarScreen() {
  const navigation = useNavigation<any>();
  const [nomeHeroi, setNomeHeroi] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCriarAvatar() {
    if (!nomeHeroi.trim()) {
      Alert.alert("Ops", "Por favor, dê um nome ao seu herói!");
      return;
    }

    setLoading(true);
    try {
      // 1. Recupera o token que salvamos no Login
      const token = await AsyncStorage.getItem('meu_token_rpg');

      // 2. Monta os dados (ID do usuário o backend pega pelo token)
      const dadosAvatar = {
        nome: nomeHeroi,
        nivel: 1,
        moedas: 0,
        atributos: "Força: 1, Agilidade: 1"
      };

      console.log("--- DEBUG DE ENVIO ---");
console.log("1. Token sendo enviado:", token);
console.log("2. Tipo do Token:", typeof token);
console.log("3. Dados do Avatar:", JSON.stringify(dadosAvatar, null, 2));

      // 3. Envia para o Backend
      await axios.post(`${API_URL}/api/avatar/criar`, dadosAvatar, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // 4. Sucesso! Vai para o jogo
      Alert.alert("Sucesso!", "Seu herói nasceu. Boa sorte!");
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao criar avatar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🛡️</Text>
      <Text style={styles.title}>Crie seu Herói</Text>
      <Text style={styles.subtitle}>Como você quer ser chamado?</Text>

      <TextInput 
        style={styles.input}
        placeholder="Nome do Personagem"
        placeholderTextColor="#888"
        value={nomeHeroi}
        onChangeText={setNomeHeroi}
      />

      <TouchableOpacity style={styles.button} onPress={handleCriarAvatar} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>COMEÇAR AVENTURA</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2c3e50', padding: 20, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f1c40f', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#ecf0f1', marginBottom: 30 },
  input: { width: '100%', backgroundColor: '#ecf0f1', borderRadius: 8, padding: 15, fontSize: 18, marginBottom: 20, color: '#2c3e50' },
  button: { width: '100%', backgroundColor: '#27ae60', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});