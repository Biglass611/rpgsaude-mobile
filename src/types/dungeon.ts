export interface DungeonDTO {
  id: number;
  nome: string;
  dificuldade: number;
  status: number; // 1 = Em andamento, 2 = Concluída
  nomeUsuario: string;
  nomeDesafio: string;
  desafioId: number;
}