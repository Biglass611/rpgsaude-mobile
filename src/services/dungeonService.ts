import api from './api';
import { DungeonDTO } from '../types/dungeon'; // Vamos criar o tipo no passo 2
import { RankingDTO } from '../types/ranking';

// Busca todas as dungeons (vamos filtrar no front)
export const listarDungeons = async () => {
  try {
    const response = await api.get<DungeonDTO[]>('/api/dungeon/listar');
    return response.data;
  } catch (error) {
    console.error("Erro ao listar dungeons:", error);
    throw error;
  }
};

// Concluir missão (Deletar a dungeon)
export const concluirDungeon = async (id: number) => {
    try {
        await api.delete(`/api/dungeon/deletar/${id}`);
    } catch (error) {
        console.error("Erro ao concluir dungeon:", error);
        throw error;
    }
};

export const getRanking = async (desafioId: number) => {
    try {
        const response = await api.get<RankingDTO[]>(`/api/dungeon/ranking/${desafioId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar ranking:", error);
        throw error;
    }
};