import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config'; 

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    console.log("Botão clicado!");
    
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha e-mail e senha!");
      return;
    }

    setLoading(true);

    try {
      // 1. TENTA LOGAR
      const urlLogin = `${API_URL}/users/login`; 
      console.log("Logando em:", urlLogin);
      
      const response = await axios.post(urlLogin, {
        email: email.trim(),
        password: senha.trim() 
      });

      // Pega o token puro
      const token = response.data.token;
      
      if (!token) {
          throw new Error("Token não veio na resposta");
      }

      // --- PASSO 1: Salva o Token (Para autenticação) ---
      await AsyncStorage.setItem('@rpgsaude_token', token);
      console.log("Token salvo corretamente em @rpgsaude_token!");

      // --- PASSO 2 (NOVO): Salva o Usuário (Para filtrar as missões) ---
      // Salvamos o email que você digitou para usar no filtro da DungeonScreen
      await AsyncStorage.setItem('@rpgsaude_usuario_login', email.trim());
      console.log("Usuário salvo para filtro:", email.trim());

      // 3. VERIFICA SE TEM AVATAR
      console.log("Verificando se tem herói...");
      
      const avatarResponse = await axios.get(`${API_URL}/api/avatar/listar`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const listaAvatares = avatarResponse.data;

      if (listaAvatares && listaAvatares.length > 0) {
        // TEM AVATAR -> Vai pro Jogo
        console.log("Avatar encontrado. Indo para Home.");
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        // NÃO TEM -> Vai criar
        console.log("Sem avatar. Indo para Criação.");
        navigation.navigate('CriarAvatar'); 
      }

    } catch (error: any) {
      console.error("Erro no login:", error);
      const msg = error.response?.data?.message || "Login falhou. Verifique senha ou conexão.";
      Alert.alert("Erro", msg);
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