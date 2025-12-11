import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Mantemos axios só para a verificação do Avatar (passo 2)
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config'; 

// --- IMPORTAÇÃO DO SERVIÇO NOVO ---
import { loginUser } from '../services/authService'; 

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    console.log("Botão clicado! Iniciando processo...");
    
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha e-mail e senha!");
      return;
    }

    setLoading(true);

    try {
      // --- PASSO 1: LOGIN (Usando o authService blindado) ---
      // A função loginUser já trata os erros 403, 404, 500 e mostra o Alert
      const data = await loginUser(email.trim(), senha.trim());
      
      // Se passou daqui, o login funcionou!
      const token = data.token;
      
      if (!token) {
          throw new Error("Login funcionou, mas o token veio vazio.");
      }

      // Salva Token e Usuário
      await AsyncStorage.setItem('@rpgsaude_token', token);
      await AsyncStorage.setItem('@rpgsaude_usuario_login', email.trim());
      console.log("Login OK. Token salvo.");

      // --- PASSO 2: VERIFICA AVATAR (Continua aqui na tela por enquanto) ---
      console.log("Verificando herói...");
      
      // Aqui usamos API_URL do config para garantir que bate com o /rpgsaude
      const avatarResponse = await axios.get(`${API_URL}/api/avatar/listar`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const listaAvatares = avatarResponse.data;

      if (listaAvatares && listaAvatares.length > 0) {
        console.log("Avatar encontrado. Indo para Home.");
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        console.log("Sem avatar. Indo para Criação.");
        navigation.navigate('CriarAvatar'); 
      }

    } catch (error) {
      // NÃO PRECISA FAZER NADA AQUI.
      // O authService já mostrou o Alert com o erro detalhado (403, 404, etc).
      console.log("Erro capturado na tela (já tratado pelo service).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RPG Saúde ⚔️</Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>

      <TextInput 
        style={styles.input}
        placeholder="Seu E-mail"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput 
        style={styles.input}
        placeholder="Sua Senha"
        placeholderTextColor="#888"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.btnText}>ENTRAR</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={{marginTop: 20}}>
        <Text style={{color: '#fff'}}>Não tem conta? <Text style={{fontWeight: 'bold', color: '#f1c40f'}}>Cadastre-se</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2c3e50', padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#f1c40f', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#ecf0f1', marginBottom: 30 },
  input: { width: '100%', backgroundColor: '#ecf0f1', borderRadius: 8, padding: 15, fontSize: 16, marginBottom: 15, color: '#2c3e50' },
  button: { width: '100%', backgroundColor: '#2980b9', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});