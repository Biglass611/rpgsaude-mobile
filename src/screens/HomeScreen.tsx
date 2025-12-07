import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config';

// Se você tiver ícones, pode importar aqui (ex: Ionicons)
// import { Ionicons } from '@expo/vector-icons'; 

export default function HomeScreen() {
  const navigation = useNavigation<any>(); // <any> resolve o erro de navegação
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
      // Pega o primeiro avatar da lista
      setAvatar(response.data[0]);
    } catch (error) {
      console.log('Erro ao carregar avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@rpgsaude_token');
    navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent:'center'}]}>
        <ActivityIndicator size="large" color="#e67e22" />
        <Text style={{color:'#fff', marginTop:10}}>Invocando Herói...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* --- CARTA DO PERSONAGEM (Mantive seu visual original) --- */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Ficha do Personagem</Text>
        <TouchableOpacity onPress={logout} style={styles.btnLogout}>
            <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardAvatar}>
        <View style={styles.avatarPlaceholder}>
             {/* Se tiver imagem real, coloque <Image /> aqui */}
             <Text style={{fontSize: 40}}>🛡️</Text> 
        </View>
        <Text style={styles.nomeAvatar}>{avatar?.nome || "Aventureiro"}</Text>
        <Text style={styles.infoAvatar}>Nível: {avatar?.nivel || 1} | Moedas: {avatar?.moedas || 0}</Text>
        <Text style={styles.atributos}>{avatar?.atributos || "Força: 0, Agilidade: 0"}</Text>
      </View>

      {/* --- MENU DE AÇÕES (Aqui acontece a mágica) --- */}
      <Text style={styles.sectionTitle}>O que deseja fazer?</Text>
      
      <View style={styles.gridMenu}>
        
        {/* 1. Botão para ver atividades que já entrou */}
        <TouchableOpacity 
            style={[styles.menuBtn, {backgroundColor: '#2980b9'}]}
            onPress={() => navigation.navigate('MinhaDungeon')}
        >
            <Text style={styles.iconBtn}>📋</Text>
            <Text style={styles.textBtn}>Minhas Atividades</Text>
        </TouchableOpacity>

        {/* 2. Botão para procurar novos grupos */}
        <TouchableOpacity 
            style={[styles.menuBtn, {backgroundColor: '#27ae60'}]}
            onPress={() => navigation.navigate('Desafios')}
        >
            <Text style={styles.iconBtn}>🔍</Text>
            <Text style={styles.textBtn}>Procurar Grupo</Text>
        </TouchableOpacity>

        {/* 3. Botão para criar um grupo novo */}
        <TouchableOpacity 
            style={[styles.menuBtn, {backgroundColor: '#8e44ad'}]}
            onPress={() => navigation.navigate('CriarDesafio')}
        >
            <Text style={styles.iconBtn}>⚔️</Text>
            <Text style={styles.textBtn}>Criar Grupo</Text>
        </TouchableOpacity>

        {/* 4. Leaderboard (Se não tiver a tela ainda, deixa um alert) */}
        <TouchableOpacity 
            style={[styles.menuBtn, {backgroundColor: '#f39c12'}]}
            onPress={() => Alert.alert("Em breve", "O Ranking Global está sendo calculado!")} 
            // Se já tiver a tela: onPress={() => navigation.navigate('Leaderboard')}
        >
            <Text style={styles.iconBtn}>🏆</Text>
            <Text style={styles.textBtn}>Ranking Global</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050511', padding: 20 },
  header: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop: 30, marginBottom: 20 },
  titulo: { color: '#f1c40f', fontSize: 24, fontWeight: 'bold', fontFamily: 'serif' }, // estilo RPG
  btnLogout: { backgroundColor: '#c0392b', padding: 5, borderRadius: 5, paddingHorizontal: 15 },
  logoutText: { color: '#fff', fontWeight: 'bold' },

  // Card do Avatar
  cardAvatar: {
    backgroundColor: '#1c1c2e',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f1c40f',
    marginBottom: 30,
    elevation: 5
  },
  avatarPlaceholder: {
    width: 80, height: 80, backgroundColor: '#34495e', borderRadius: 40,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10
  },
  nomeAvatar: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  infoAvatar: { color: '#bdc3c7', fontSize: 16, marginVertical: 5 },
  atributos: { color: '#e67e22', fontSize: 14, fontStyle: 'italic' },

  // Menu Grid
  sectionTitle: { color: '#fff', fontSize: 18, marginBottom: 15, fontWeight: 'bold' },
  gridMenu: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  menuBtn: {
    width: '48%', // Para caber 2 por linha
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3
  },
  iconBtn: { fontSize: 30, marginBottom: 10 },
  textBtn: { color: '#fff', fontWeight: 'bold', fontSize: 14, textAlign: 'center' }
});