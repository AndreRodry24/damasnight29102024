// removerNumEstranjeiros.js

// Função para verificar se um número é brasileiro
const isBrazilianNumber = (number) => {
    // Remove caracteres não numéricos
    const cleanNumber = number.replace(/\D/g, ''); // '558596603268'
    return cleanNumber.startsWith('55') && (cleanNumber.length === 14 || cleanNumber.length === 13);
};

// Função para remover números estrangeiros
const removerNumEstrangeiros = async (conn, groupId) => {
    const group = await conn.groupMetadata(groupId);
    const participantes = group.participants;

    for (const participante of participantes) {
        const numero = participante.id;

        if (!isBrazilianNumber(numero)) {
            try {
                await conn.groupParticipantsUpdate(groupId, [numero], 'remove');
            } catch (error) {
                console.error(`Erro ao remover ${numero} do grupo ${groupId}:`, error);
            }
        }
    }
};

// Exportar a função para ser usada em outros módulos
export default removerNumEstrangeiros;
