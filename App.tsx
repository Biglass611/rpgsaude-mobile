import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- SEUS ARQUIVOS (Importando exatamente com os nomes que você mandou) ---
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreateAvatarScreen from './src/screens/CreateAvatarScreen'; 
import CriarDesafioScreen from './src/screens/CriarDesafioScreen';
import MinhaDungeonScreen from './src/screens/MinhaDungeonScreen';
import DesafiosScreen from './src/screens/DesafiosScreen'; 
import HidratacaoScreen from './src/screens/HidratacaoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator id="root" initialRouteName="Login">
        
        {/* --- AUTENTICAÇÃO --- */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        
        <Stack.Screen 
          name="Cadastro" 
          component={CadastroScreen} 
          options={{ title: 'Criar Conta' }} 
        />

        {/* --- FLUXO PRINCIPAL --- */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="CriarAvatar" 
          component={CreateAvatarScreen} 
          options={{ title: 'Criar Personagem', headerShown: false }} 
        />

        {/* --- MENU / FUNCIONALIDADES --- */}
        
        {/* Tela de Buscar Grupos (Botão Verde da Home) */}
        <Stack.Screen 
          name="Desafios" 
          component={DesafiosScreen} 
          options={{ title: 'Buscar Grupos' }} 
        />

        {/* Tela de Criar Grupo (Botão Roxo da Home) */}
        <Stack.Screen 
          name="CriarDesafio" 
          component={CriarDesafioScreen} 
          options={{ title: 'Calcule seu IMC' }} 
        />

        {/* Tela de Minhas Atividades (Botão Azul da Home) */}
        <Stack.Screen 
          name="MinhaDungeon" 
          component={MinhaDungeonScreen} 
          options={{ title: 'Minhas Missões' }} 
        />

        {/* Tela de Ranking (Botão Amarelo da Home) */}
        <Stack.Screen 
          name="Hidratacao" 
          component={HidratacaoScreen} 
          options={{ title: 'Calculo de Água' }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}