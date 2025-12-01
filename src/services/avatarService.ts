import api from './api';
import { AvatarDTO } from '../types/avatar';

export const getMeusAvatares = async () => {
  try {
    // O endpoint retorna uma lista de avatares
    const response = await api.get<AvatarDTO[]>('/api/avatar/listar');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar avatar:", error);
    throw error;
  }
};