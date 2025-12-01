export interface DesafioDTO {
  id: number;
  nome: string;
  descricao: string;
  tipo: string;
  chefeId: number;
  nomeRecompensa: string; // Para mostrar o que ganha
}