// avisoadm.js
import pkg from '@whiskeysockets/baileys';

const MessageType = pkg.MessageType || pkg['MessageType'] || pkg.default?.MessageType;

// Array para armazenar mensagens de promoção
let promotionMessages = [];

// Defina seu número de WhatsApp
const yourNumber = '558599495181@s.whatsapp.net';

// Função para lidar com atualizações de participantes de grupo
export async function handleGroupParticipantsUpdate(c, update, botInfo) {
    console.log('Update recebido:', update);

    // Verifica se a ação é uma promoção e se há participantes suficientes
    if (update.action === 'promote' && update.participants.length >= 1) {
        const adminPromoted = update.participants[0];
        const adminWhoPromoted = update.author;

        const message = `✅ O usuário @${adminPromoted.split('@')[0]} foi promovido a administrador por @${adminWhoPromoted.split('@')[0]}.`;

        // Enviar mensagem para o seu número
        await c.sendMessage(yourNumber, {
            text: message,
            mentions: [adminPromoted, adminWhoPromoted],
            quoted: null
        });

        promotionMessages.push({
            id: update.id,
            message: message,
            promotedBy: adminWhoPromoted,
            promotedUser: adminPromoted
        });

        console.log('Mensagem armazenada:', {
            id: update.id,
            message: message,
            promotedBy: adminWhoPromoted,
            promotedUser: adminPromoted
        });

    } else if (update.action === 'demote' && update.participants.length >= 1) {
        const adminDemoted = update.participants[0];
        const adminWhoDemoted = update.author;

        const message = `❌ O usuário @${adminDemoted.split('@')[0]} foi rebaixado de administrador por @${adminWhoDemoted.split('@')[0]}.`;

        // Enviar mensagem para o seu número
        await c.sendMessage(yourNumber, {
            text: message,
            mentions: [adminDemoted, adminWhoDemoted],
            quoted: null
        });

        console.log('Mensagem de rebaixamento enviada:', message);
    } else {
        console.log('Ação não é uma promoção ou participantes insuficientes.');
    }
}
