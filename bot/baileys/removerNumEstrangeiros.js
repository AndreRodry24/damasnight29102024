// removerNumEstrangeiros.js

// Função para verificar se um número é brasileiro
const isBrazilianNumber = (number) => {
    // Remove caracteres não numéricos
    const cleanNumber = number.replace(/\D/g, '');

    // Verifica se o número começa com '55' e tem 13 caracteres (9 dígitos) ou 12 caracteres (8 dígitos)
    return cleanNumber.startsWith('55') && (cleanNumber.length === 13 || cleanNumber.length === 12);
};

// Função para remover números estrangeiros
const removerNumEstrangeiros = async (conn, groupId) => {
    const group = await conn.groupMetadata(groupId);
    const participantes = group.participants;

    for (const participante of participantes) {
        const numero = participante.id;

        if (!isBrazilianNumber(numero)) {
            try {
                console.log(`Removendo número estrangeiro: ${numero}`);
                await conn.groupParticipantsUpdate(groupId, [numero], 'remove');
            } catch (error) {
                console.error(`Erro ao remover ${numero} do grupo ${groupId}:`, error);
            }
        } else {
            console.log(`Número brasileiro detectado: ${numero}`);
        }
    }
};

// Exportar a função para ser usada em outros módulos
export default removerNumEstrangeiros;
