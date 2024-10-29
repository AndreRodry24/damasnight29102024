//videoMonitor.js
const videoLimit = 3; // Limite de vídeos permitidos
const userVideoData = {}; // Objeto para armazenar a contagem de vídeos e a data do último envio

// Função para monitorar o envio de vídeos
export const monitorVideos = async (conn, message) => {
    const { remoteJid: from } = message.key; // Obtém o ID do grupo/conversa
    const participant = message.key.participant || message.participant || from; // Obtém o remetente (ou o ID do grupo se não estiver definido)
    const videoMessage = message.message?.videoMessage; // Verifica se a mensagem é de vídeo

    // Verifique se `from` e `videoMessage` são definidos
    if (!from || !videoMessage) {
        return; // Sai da função se os valores essenciais estiverem indefinidos
    }

    const today = new Date().toDateString(); // Obtém a data de hoje

    // Inicializa a contagem para o usuário se não existir
    if (!userVideoData[participant]) {
        userVideoData[participant] = {
            count: 0,
            date: today
        };
    }

    // Se a data armazenada não for igual à data de hoje, reseta a contagem
    if (userVideoData[participant].date !== today) {
        userVideoData[participant].count = 0; // Reseta a contagem
        userVideoData[participant].date = today; // Atualiza a data
    }

    // Incrementa a contagem de vídeos do usuário
    userVideoData[participant].count++;

    // Verifica se o usuário enviou 3 vídeos
    if (userVideoData[participant].count === 3) {
        const mentionMessage = `@${participant.split('@')[0]}, você enviou 3 vídeos. Se mandar o quarto, você será removido do grupo, pois o limite é somente 3 por dia. Leia as regras.`;
        await conn.sendMessage(from, { text: mentionMessage, mentions: [participant] });
    }

    // Verifica se o usuário ultrapassou o limite
    if (userVideoData[participant].count > videoLimit) {
        try {
            await conn.groupParticipantsUpdate(from, [participant], 'remove');

            // Reseta a contagem do usuário após a remoção
            delete userVideoData[participant];
        } catch (error) {
            // Log de erro (pode ser mantido se necessário)
            console.error(`Erro ao remover ${participant} do grupo:`, error);
        }
    }
};
