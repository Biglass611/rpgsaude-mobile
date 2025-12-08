import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config';
import { jwtDecode } from "jwt-decode";

export default function CreateAvatarScreen() {
  // CORREÇÃO 1: Adicionei <any> para ele aceitar qualquer nome de rota ('Home', 'LoginScreen', etc)
  const navigation = useNavigation<any>(); 
  
  const [nomeHeroi, setNomeHeroi] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkToken() {
      const token = await AsyncStorage.getItem('@rpgsaude_token');
      if (!token) {
        Alert.alert("Sessão Expirada", "Faça login novamente.");
        // Certifique-se que o nome 'Login' é EXATAMENTE como está no seu App.js ou rotas
        navigation.navigate('Login'); 
      }
    }
    checkToken();
  }, []);

 async function handleCriarAvatar() {
    if (!nomeHeroi.trim()) {
      Alert.alert("Ops", "Por favor, dê um nome ao seu herói!");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@rpgsaude_token');
      
      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(token);
      const idUsuarioLogado = decoded.sub; 

      // --- AQUI ESTÁ A MUDANÇA ---
      // Tentativa 1: Formato de Objeto (Padrão JPA/Spring)
      const dadosAvatar = {
        usuario: { id: idUsuarioLogado }, // <--- MUDAMOS ISSO
        nome: nomeHeroi,
        nivel: 1,
        moedas: 0,
        atributos: "Força: 1, Agilidade: 1"
      };
      // ----------------------------

      console.log("--- DEBUG DE ENVIO ---");
      console.log("Payload:", JSON.stringify(dadosAvatar, null, 2));

      await axios.post(`${API_URL}/api/avatar/criar`, dadosAvatar, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      Alert.alert("Sucesso!", "Seu herói nasceu. Boa sorte!");
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });

    } catch (error: any) {
      console.error("ERRO AO CRIAR AVATAR:", error);
      // Às vezes o erro 403 não retorna mensagem JSON, então tratamos isso:
      const mensagemErro = error.response?.data?.message || "Permissão negada (403). Verifique o console do servidor.";
      Alert.alert("Erro", mensagemErro);
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