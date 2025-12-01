import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { getMeusAvatares } from '../services/avatarService';
import { logout } from '../services/authService';
import { AvatarDTO } from '../types/avatar';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [avatar, setAvatar] = useState<AvatarDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Função que carrega os dados
  const carregarDados = async () => {
    try {
      setLoading(true);
      const lista = await getMeusAvatares();
      
      // Como a relação é 1:1, pegamos o primeiro da lista
      if (lista.length > 0) {
        setAvatar(lista[0]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar seu avatar.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect roda assim que a tela abre
  useEffect(() => {
    carregarDados();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho com Saudação e Logout */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Olá, {avatar?.nomeUsuario || 'Guerreiro'}!</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Cartão do Avatar */}
      {avatar ? (
        <View style={styles.card}>
          <View style={styles.avatarIcon}>
            <Text style={styles.avatarEmoji}>🛡️</Text>
          </View>
          
          <Text style={styles.charName}>{avatar.nome}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Nível</Text>
              <Text style={styles.statValue}>{avatar.nivel}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Moedas</Text>
              <Text style={styles.statValue}>💰 {avatar.moedas}</Text>
            </View>
          </View>

          <View style={styles.attrsContainer}>
            <Text style={styles.attrTitle}>Atributos:</Text>
            <Text style={styles.attrText}>{avatar.atributos || "Nenhum atributo definido"}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>Nenhum avatar encontrado.</Text>
      )}

      {/* MENU DE BOTÕES */}
    <View style={styles.menuContainer}>
        
        {/* BOTÃO NOVO AQUI: Minhas Dungeons */}
        <TouchableOpacity 
          style={[styles.menuButton, { backgroundColor: '#f39c12' }]} 
          onPress={() => navigation.navigate('MinhaDungeon')}
        >
          <Text style={styles.btnText}>🏰 MINHAS DUNGEONS</Text>
        </TouchableOpacity>

        {/* Botão 2: Procurar novos grupos/desafios (Já existia) */}
        <TouchableOpacity 
          style={[styles.menuButton, { backgroundColor: '#3498db' }]} 
          onPress={() => navigation.navigate('Desafios')}
        >
          <Text style={styles.btnText}>🔍 PROCURAR GRUPO</Text>
        </TouchableOpacity>

        {/* Botão 3: Criar meu próprio grupo (Já existia) */}
        <TouchableOpacity 
          style={[styles.menuButton, { backgroundColor: '#9b59b6' }]} 
          onPress={() => navigation.navigate('CriarDesafio')}
        >
          <Text style={styles.btnText}>➕ CRIAR GRUPO</Text>
        </TouchableOpacity>
    </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ecf0f1', padding: 20, paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcome: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  logoutBtn: { backgroundColor: '#e74c3c', padding: 8, borderRadius: 5 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 20, alignItems: 'center', elevation: 4 },
  avatarIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#3498db', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarEmoji: { fontSize: 40 },
  charName: { fontSize: 24, fontWeight: 'bold', color: '#34495e', marginBottom: 20 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  stat: { alignItems: 'center' },
  statLabel: { fontSize: 14, color: '#7f8c8d' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  
  attrsContainer: { alignSelf: 'flex-start', width: '100%', padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8 },
  attrTitle: { fontWeight: 'bold', marginBottom: 5 },
  attrText: { color: '#555' },
  errorText: { textAlign: 'center', marginTop: 50, color: '#7f8c8d' },

  // Estilos dos Novos Botões
  menuContainer: { width: '100%', marginTop: 20 },
  menuButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 3,
  },
  btnText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});