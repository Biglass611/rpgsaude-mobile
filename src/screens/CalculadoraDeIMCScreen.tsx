import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Keyboard, 
  Alert, 
  ScrollView,
  Modal,
  FlatList
} from 'react-native';

// --- CORREÇÃO: Interface para definir os tipos ---
interface RankingItem {
  id: string;
  nome: string;
  imc: number;
  classe: string;
  isUser?: boolean; // Campo opcional
}

const RANKING_INICIAL: RankingItem[] = [
  { id: '1', nome: 'Thor Odinson', imc: 29.5, classe: 'Viking Robusto' },
  { id: '2', nome: 'Legolas Green', imc: 22.1, classe: 'Paladino Equilibrado' },
  { id: '3', nome: 'Gimli Gloin', imc: 31.2, classe: 'Ogro de Batalha' },
  { id: '4', nome: 'Arya Stark', imc: 18.2, classe: 'Ladino Sombrio' },
  { id: '5', nome: 'Conan Bárbaro', imc: 27.8, classe: 'Viking Robusto' },
];

export default function CalculadoraIMCScreen() {
  const [peso, setPeso] = useState<string>('');
  const [altura, setAltura] = useState<string>('');
  
  const [resultado, setResultado] = useState<string | null>(null);
  const [classeRPG, setClasseRPG] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [corStatus, setCorStatus] = useState<string>('#fff');

  // Estados do Ranking
  const [modalVisible, setModalVisible] = useState(false);
  // --- CORREÇÃO AQUI: Tipando o useState ---
  const [rankingData, setRankingData] = useState<RankingItem[]>(RANKING_INICIAL);

  const textoAviso = "O IMC é uma estimativa geral e não distingue gordura de massa muscular. Cada corpo é único. Utilize este resultado apenas como referência inicial e consulte sempre um profissional de saúde.";

  const exibirInfo = () => {
    Alert.alert("Informação Importante", textoAviso, [{ text: "Entendi" }]);
  };

  const calcularIMC = () => {
    const pesoNum = parseFloat(peso.replace(',', '.'));
    const alturaNum = parseFloat(altura.replace(',', '.'));

    if (!pesoNum || !alturaNum) {
      Alert.alert("Dados inválidos", "Por favor, digite seu peso e altura corretamente.");
      return;
    }

    const imc = pesoNum / (alturaNum * alturaNum);
    const imcFormatado = imc.toFixed(2);

    let classe = "";
    let desc = "";
    let cor = "";

    if (imc < 18.5) {
      classe = "Ladino Sombrio (Abaixo do Peso)";
      desc = "Você é ágil e leve, mas sua vitalidade (HP) está baixa. Precisa de 'buffs' de proteína e carboidratos.";
      cor = "#00bcd4"; 
    } else if (imc >= 18.5 && imc < 24.9) {
      classe = "Paladino Equilibrado (Peso Normal)";
      desc = "Seus atributos estão perfeitamente balanceados! Você tem a melhor performance em combate.";
      cor = "#28a745"; 
    } else if (imc >= 25 && imc < 29.9) {
      classe = "Viking Robusto (Sobrepeso)";
      desc = "Força bruta alta, mas stamina comprometida. Cuidado com o excesso de carga no inventário.";
      cor = "#ffc107"; 
    } else if (imc >= 30 && imc < 39.9) {
      classe = "Ogro de Batalha (Obesidade)";
      desc = "Defesa alta, mas agilidade sofre penalidades. Risco de debuffs de saúde. Recomendamos missões de cardio.";
      cor = "#ff6f00"; 
    } else {
      classe = "Titã Colossal (Obesidade Grave)";
      desc = "Seu tamanho impõe respeito, mas é perigoso para seu coração. Procure um Curandeiro urgentemente.";
      cor = "#d32f2f"; 
    }

    setResultado(imcFormatado);
    setClasseRPG(classe);
    setDescricao(desc);
    setCorStatus(cor);
    
    // Cria um novo jogador com os dados atuais
    const novoJogador: RankingItem = {
      id: 'user_now',
      nome: 'VOCÊ (Agora)',
      imc: parseFloat(imcFormatado),
      classe: classe.split('(')[0].trim(),
      isUser: true // Agora isso é permitido!
    };

    const novoRanking = [...RANKING_INICIAL, novoJogador].sort((a, b) => b.imc - a.imc);
    setRankingData(novoRanking);

    Keyboard.dismiss();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        <View style={styles.headerContainer}>
           <Text style={styles.titulo}>Forja de Atributos</Text>
           <TouchableOpacity style={styles.infoButton} onPress={exibirInfo}>
             <Text style={styles.infoText}>i</Text>
           </TouchableOpacity>
        </View>

        <Text style={styles.subtitulo}>Calcule seu IMC e descubra sua classe!</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 75.5"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={peso}
            onChangeText={setPeso}
          />

          <Text style={styles.label}>Altura (m)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 1.75"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={altura}
            onChangeText={setAltura}
          />

          <TouchableOpacity style={styles.botaoCalcular} onPress={calcularIMC}>
            <Text style={styles.textoBotao}>CALCULAR CLASSE</Text>
          </TouchableOpacity>
        </View>

        {resultado && (
          <View style={[styles.resultadoContainer, { borderColor: corStatus }]}>
            <Text style={styles.labelResultado}>Seu IMC é:</Text>
            <Text style={[styles.valorResultado, { color: corStatus }]}>{resultado}</Text>
            
            <Text style={[styles.classeRPG, { color: corStatus }]}>{classeRPG}</Text>
            
            <View style={styles.separador} />
            
            <Text style={styles.descricaoRPG}>{descricao}</Text>

            <TouchableOpacity 
              style={[styles.botaoRanking, { backgroundColor: corStatus }]} 
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.textoBotaoRanking}>🏆 VER NO HALL DA FAMA</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.avisoContainer}>
            <Text style={styles.avisoTexto}>
                <Text style={styles.avisoLabel}>Nota: </Text>
                {textoAviso}
            </Text>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitulo}>Hall da Fama ⚔️</Text>
              <Text style={styles.modalSubtitulo}>Comparativo de Massa (IMC)</Text>

              <FlatList
                data={rankingData}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <View style={[
                    styles.itemRanking, 
                    item.isUser && styles.itemRankingUser 
                  ]}>
                    <Text style={styles.posicao}>{index + 1}º</Text>
                    <View style={styles.infoRanking}>
                      <Text style={[styles.nomeRanking, item.isUser && styles.textoDestaque]}>
                        {item.nome}
                      </Text>
                      <Text style={styles.classeRanking}>{item.classe}</Text>
                    </View>
                    <Text style={styles.imcRanking}>{item.imc.toFixed(1)}</Text>
                  </View>
                )}
              />

              <TouchableOpacity 
                style={styles.botaoFechar} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textoFechar}>Fechar Hall</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { 
    flexGrow: 1, 
    backgroundColor: '#121212' 
  },
  container: { 
    flex: 1, 
    padding: 20, 
    alignItems: 'center' 
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 10,
    marginBottom: 5
  },
  titulo: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff', 
    textAlign: 'center'
  },
  infoButton: {
    position: 'absolute',
    right: 0,
    top: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: '#8A2BE2',
    fontWeight: 'bold',
    fontSize: 18,
    fontStyle: 'italic',
    marginTop: -2
  },
  subtitulo: { 
    fontSize: 16, 
    color: '#aaa', 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  form: { 
    width: '100%', 
    marginBottom: 20 
  },
  label: { 
    color: '#ccc', 
    fontSize: 16, 
    marginBottom: 5, 
    marginLeft: 5 
  },
  input: { 
    backgroundColor: '#1e1e1e', 
    color: '#fff', 
    borderRadius: 12, 
    padding: 15, 
    fontSize: 18, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  botaoCalcular: { 
    backgroundColor: '#8A2BE2', 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    elevation: 5
  },
  textoBotao: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  resultadoContainer: { 
    width: '100%', 
    backgroundColor: '#1e1e1e', 
    padding: 20, 
    borderRadius: 15, 
    alignItems: 'center', 
    borderWidth: 2, 
    marginTop: 10 
  },
  labelResultado: { 
    color: '#aaa', 
    fontSize: 14, 
    textTransform: 'uppercase' 
  },
  valorResultado: { 
    fontSize: 48, 
    fontWeight: 'bold', 
    marginVertical: 5 
  },
  classeRPG: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 10 
  },
  separador: { 
    width: '80%', 
    height: 1, 
    backgroundColor: '#333', 
    marginVertical: 10 
  },
  descricaoRPG: { 
    color: '#ddd', 
    fontSize: 16, 
    textAlign: 'center', 
    lineHeight: 22, 
    fontStyle: 'italic' 
  },
  avisoContainer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    width: '100%',
    paddingBottom: 20
  },
  avisoTexto: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    lineHeight: 18
  },
  avisoLabel: {
    fontWeight: 'bold',
    color: '#999'
  },
  botaoRanking: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
    width: '100%',
    alignItems: 'center'
  },
  textoBotaoRanking: {
    color: '#000', 
    fontWeight: 'bold',
    fontSize: 14
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    borderRadius: 15,
    padding: 20,
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: '#444'
  },
  modalTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5
  },
  modalSubtitulo: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20
  },
  itemRanking: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  itemRankingUser: {
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 0,
    marginVertical: 2
  },
  posicao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffc107',
    width: 35,
  },
  infoRanking: {
    flex: 1,
    marginLeft: 5
  },
  nomeRanking: {
    fontSize: 16,
    color: '#eee',
    fontWeight: '600'
  },
  classeRanking: {
    fontSize: 12,
    color: '#888'
  },
  imcRanking: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  textoDestaque: {
    color: '#8A2BE2',
    fontWeight: 'bold'
  },
  botaoFechar: {
    marginTop: 20,
    alignSelf: 'center',
    padding: 10
  },
  textoFechar: {
    color: '#aaa',
    fontSize: 16
  }
});