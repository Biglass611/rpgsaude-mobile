import api from './api';
import { DesafioDTO } from '../types/desafio';

export const listarDesafios = async () => {
  try {
    const response = await api.get<DesafioDTO[]>('/api/desafio/listar');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar desafios:", error);
    throw error;
  }
};

export const entrarNaDungeon = async (desafioId: number, usuarioId: number) => {
    // Aqui vamos chamar a API para criar a Dungeon (Vincular usuário ao desafio)
    // Vamos precisar ajustar o DTO de DungeonRequest depois
    try {
        const response = await api.post('/api/dungeon/criar', {
            nome: "Minha Dungeon",
            dificuldade: 1,
            status: 1, // 1 = Em andamento
            usuarioId: usuarioId,
            desafioId: desafioId
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao entrar na dungeon:", error);
        throw error;
    }
}