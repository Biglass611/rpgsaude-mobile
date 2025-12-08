import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from 'react-native';

export default function HidratacaoScreen() {
  const [peso, setPeso] = useState('');
  const [metaDiaria, setMetaDiaria] = useState<number | null>(null);
  const [consumido, setConsumido] = useState(0);
  const [percentual, setPercentual] = useState(0);

  const calcularMeta = () => {
    const pesoNum = parseFloat(peso.replace(',', '.'));
    
    if (!pesoNum || pesoNum <= 0) {
      Alert.alert("Erro", "Digite um peso válido para calcular sua mana.");
      return;
    }

    // Fórmula: 35ml por KG
    const meta = pesoNum * 35;
    setMetaDiaria(meta);
    // Reseta o consumo se recalcular
    setConsumido(0);
    setPercentual(0);
  };

  const beberAgua = (ml: number) => {
    if (!metaDiaria) {
      Alert.alert("Atenção", "Calcule sua meta primeiro!");
      return;
    }

    const novoConsumo = consumido + ml;
    setConsumido(novoConsumo);

    // Calcula a porcentagem para a barra de progresso (máximo 100%)
    let novaPorcentagem = (novoConsumo / metaDiaria) * 100;
    if (novaPorcentagem > 100) novaPorcentagem = 100;
    setPercentual(novaPorcentagem);

    // Feedback se atingiu a meta
    if (consumido < metaDiaria && novoConsumo >= metaDiaria) {
      Alert.alert("🎉 Mana Restaurada!", "Você atingiu sua meta de hidratação diária! Seu personagem está com 100% de performance.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        <Text style={styles.titulo}>Fonte de Mana 💧</Text>
        <Text style={styles.subtitulo}>A água restaura sua energia vital.</Text>

        {/* --- INPUT DE PESO --- */}
        {!metaDiaria ? (
          <View style={styles.form}>
            <Text style={styles.label}>Qual o peso do seu personagem?</Text>
            <View style={styles.inputRow}>
                <TextInput
                style={styles.input}
                placeholder="Ex: 70"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={peso}
                onChangeText={setPeso}
                />
                <Text style={styles.unidade}>kg</Text>
            </View>

            <TouchableOpacity style={styles.botaoCalcular} onPress={calcularMeta}>
              <Text style={styles.textoBotao}>DEFINIR META DE MANA</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.trackerContainer}>
            {/* Se quiser mudar o peso, um botãozinho discreto */}
            <TouchableOpacity onPress={() => setMetaDiaria(null)}>
                <Text style={styles.resetText}>Alterar peso ({peso}kg)</Text>
            </TouchableOpacity>

            <Text style={styles.metaTexto}>Meta Diária: {metaDiaria.toFixed(0)} ml</Text>
            
            {/* --- BARRA DE PROGRESSO (MANA BAR) --- */}
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${percentual}%` }]} />
            </View>
            <Text style={styles.porcentagemTexto}>{percentual.toFixed(0)}% Restaurado</Text>

            <Text style={styles.consumidoTexto}>
                <Text style={styles.destaqueAzul}>{consumido}</Text> / {metaDiaria.toFixed(0)} ml
            </Text>

            {/* --- BOTÕES DE BEBER --- */}
            <View style={styles.botoesContainer}>
                <TouchableOpacity style={styles.botaoAgua} onPress={() => beberAgua(250)}>
                    <Text style={styles.emojiAgua}>🥛</Text>
                    <Text style={styles.textoAgua}>Copo (250ml)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botaoAgua} onPress={() => beberAgua(500)}>
                    <Text style={styles.emojiAgua}>🍶</Text>
                    <Text style={styles.textoAgua}>Garrafa (500ml)</Text>
                </TouchableOpacity>
            </View>

          </View>
        )}

        {/* Dica RPG */}
        <View style={styles.cardDica}>
            <Text style={styles.tituloDica}>Sabedoria Ancestral</Text>
            <Text style={styles.textoDica}>
                "Guerreiros desidratados perdem Inteligência e Força. 
                Beba água para evitar o debuff de 'Confusão Mental'."
            </Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#121212' },
  container: { flex: 1, padding: 20, alignItems: 'center' },
  
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#00bcd4', marginTop: 10, marginBottom: 5 },
  subtitulo: { fontSize: 16, color: '#aaa', marginBottom: 30, textAlign: 'center' },
  
  form: { width: '100%', alignItems: 'center' },
  label: { color: '#ccc', fontSize: 18, marginBottom: 15 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  input: { 
    backgroundColor: '#1e1e1e', 
    color: '#fff', 
    borderRadius: 12, 
    padding: 15, 
    fontSize: 24, 
    width: 120,
    textAlign: 'center',
    borderWidth: 1, 
    borderColor: '#333' 
  },
  unidade: { color: '#fff', fontSize: 20, marginLeft: 10, fontWeight: 'bold' },
  
  botaoCalcular: { 
    backgroundColor: '#00bcd4', // Ciano (cor de mana/água)
    paddingVertical: 15, 
    paddingHorizontal: 40,
    borderRadius: 12, 
    elevation: 5,
    width: '100%'
  },
  textoBotao: { color: '#000', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },

  // --- Tracker Styles ---
  trackerContainer: { width: '100%', alignItems: 'center' },
  resetText: { color: '#666', textDecorationLine: 'underline', marginBottom: 15 },
  metaTexto: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  
  progressBarContainer: {
    width: '100%',
    height: 30,
    backgroundColor: '#333',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#555',
    marginBottom: 10
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00bcd4', // A barra azul enchendo
  },
  porcentagemTexto: { color: '#00bcd4', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  consumidoTexto: { color: '#aaa', fontSize: 18, marginBottom: 30 },
  destaqueAzul: { color: '#fff', fontWeight: 'bold', fontSize: 24 },

  botoesContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  botaoAgua: {
    backgroundColor: '#1e1e1e',
    width: '48%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00bcd4'
  },
  emojiAgua: { fontSize: 32, marginBottom: 5 },
  textoAgua: { color: '#fff', fontWeight: '600' },

  // --- Dica Card ---
  cardDica: {
    marginTop: 20,
    backgroundColor: '#1a262a', // Um azulado bem escuro
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00bcd4',
    width: '100%'
  },
  tituloDica: { color: '#00bcd4', fontWeight: 'bold', marginBottom: 5 },
  textoDica: { color: '#ccc', fontStyle: 'italic', lineHeight: 20 }
});