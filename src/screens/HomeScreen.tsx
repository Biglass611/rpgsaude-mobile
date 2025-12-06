import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from './config';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [avatar, setAvatar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAvatar();
  }, []);

  const carregarAvatar = async () => {
    try {
      const token = await AsyncStorage.getItem('@rpgsaude_token');
      const response = await axios.get(`${API_URL}/api/avatar/listar`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.length > 0) setAvatar(response.data[0]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@rpgsaude_token');
    navigation.replace('Login');
  };

  if (loading) return <ActivityIndicator style={{marginTop:50}} size="large" color="#3498db" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Olá, {avatar?.nomeUsuario}</Text>
        <TouchableOpacity onPress={logout} style={styles.logout}><Text style={styles.logoutText}>Sair</Text></TouchableOpacity>
      </View>

      {avatar && (
        <View style={styles.card}>
          <Text style={{fontSize: 40}}>🛡️</Text>
          <Text style={styles.nome}>{avatar.nome}</Text>
          <Text>Nível: {avatar.nivel} | Moedas: {avatar.moedas}</Text>
        </View>
      )}

      <TouchableOpacity style={[styles.btn, {backgroundColor:'#3498db'}]} onPress={() => navigation.navigate('Desafios')}>
        <Text style={styles.btnText}>🔍 PROCURAR GRUPO</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.btn, {backgroundColor:'#f39c12'}]} onPress={() => navigation.navigate('MinhaDungeon')}>
        <Text style={styles.btnText}>🏰 MINHAS MISSÕES</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, {backgroundColor:'#9b59b6'}]} onPress={() => navigation.navigate('CriarDesafio')}>
        <Text style={styles.btnText}>➕ CRIAR GRUPO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#ecf0f1' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  welcome: { fontSize: 18, fontWeight: 'bold' },
  logout: { backgroundColor: '#e74c3c', padding: 5, borderRadius: 5 },
  logoutText: { color: '#fff' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  nome: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
  btn: { padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});