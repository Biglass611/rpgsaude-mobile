// O que mandamos para logar
export interface LoginDTO {
  email: string;
  password: string;
}

// O que recebemos ao logar
export interface LoginResponseDTO {
  token: string;
}

// O que mandamos para cadastrar (Status 1 = Ativo)
export interface CadastroDTO {
  email: string;
  senha: string;
  status: number; 
}