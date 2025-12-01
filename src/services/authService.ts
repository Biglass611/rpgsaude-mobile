import api from './api';
import { LoginDTO, LoginResponseDTO, CadastroDTO } from '../types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (data: LoginDTO) => {
  try {
    // POST /users/login
    const response = await api.post<LoginResponseDTO>('/users/login', data);
    
    // Se o backend retornar o token, salvamos no celular
    if (response.data.token) {
        await AsyncStorage.setItem('@rpgsaude_token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

export const cadastrar = async (data: CadastroDTO) => {
  try {
    // POST /users/criar
    const response = await api.post('/users/criar', data);
    return response.data;
  } catch (error) {
    console.error("Erro no cadastro:", error);
    throw error;
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('@rpgsaude_token');
};