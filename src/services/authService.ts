import axios from 'axios';
import { Alert } from 'react-native';
// AQUI ESTAVA O ERRO: Mudamos de BASE_URL para API_URL
import { API_URL } from '../config'; 

export const loginUser = async (email: string, password: string) => {
  // Mudamos aqui também para usar API_URL
  console.log(`Tentando logar em: ${API_URL}/users/login`);

  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      login: email, 
      senha: password
    });

    return response.data; 

  } catch (error: any) {
    let mensagemErro = "Erro desconhecido";

    if (error.response) {
      const status = error.response.status;
      
      if (status === 403) {
        mensagemErro = "⛔ ERRO 403: Acesso negado. O servidor da faculdade pode estar desatualizado ou bloqueando o app.";
      } else if (status === 401) {
        mensagemErro = "🔒 Senha ou usuário incorretos.";
      } else if (status === 404) {
        mensagemErro = "🔍 Endereço não encontrado (404). Verifique a URL.";
      } else if (status === 500) {
        mensagemErro = "🔥 Erro Interno do Servidor (500). O Java quebrou.";
      } else {
        mensagemErro = `Erro ${status}: ${JSON.stringify(error.response.data)}`;
      }
    } else if (error.request) {
      mensagemErro = "📡 Sem resposta. Verifique: 1. Sua internet. 2. Se é http (e não https). 3. Se o servidor está ligado.";
    } else {
      mensagemErro = `Erro de Configuração: ${error.message}`;
    }

    Alert.alert("Diagnóstico", mensagemErro);
    throw error;
  }
};