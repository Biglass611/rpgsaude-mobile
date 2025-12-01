import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Importando todas as telas
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import HomeScreen from './src/screens/HomeScreen';
import DesafiosScreen from './src/screens/DesafiosScreen';
import CriarDesafioScreen from './src/screens/CriarDesafioScreen';
import MinhaDungeonScreen from './src/screens/MinhaDungeonScreen';
import LeaderboardScreen from './src/screens/LeaderBoardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="Login">
        
        {/* Telas de Acesso */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Cadastro" 
          component={CadastroScreen} 
          options={{ headerShown: false }} 
        />

        {/* Telas Principais */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />

        {/* Telas de Funcionalidade */}
        <Stack.Screen 
          name="Desafios" 
          component={DesafiosScreen} 
          options={{ title: 'Procurar Grupo/Missão' }} 
        />
        
        <Stack.Screen 
          name="CriarDesafio" 
          component={CriarDesafioScreen} 
          options={{ title: 'Criar Novo Grupo' }} 
        />
        
        <Stack.Screen 
          name="MinhaDungeon" 
          component={MinhaDungeonScreen} 
          options={{ title: 'Minhas Dungeons Ativas' }} 
        />
        
        <Stack.Screen 
          name="Leaderboard" 
          component={LeaderboardScreen} 
          options={{ 
            title: '🏆 Ranking do Grupo',
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#2c3e50' }
          }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}