import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from './config';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha email e senha.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email: email,
        senha: password // Backend espera 'senha'
      });

      if (response.data.token) {
        await AsyncStorage.setItem('@rpgsaude_token', response.data.token);
        // Salva o email também para usar depois
        await AsyncStorage.setItem('@rpgsaude_user_email', email);
        Alert.alert('Sucesso', 'Login realizado!');
        navigation.replace('Home');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Falha no login. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RPG Saúde 🛡️</Text>
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.textBtn}>ENTRAR</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={styles.link}>
        <Text style={styles.linkText}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#2c3e50' },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center' },
  textBtn: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#3498db' }
});