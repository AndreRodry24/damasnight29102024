// // avisoadm.js
// import pkg from '@whiskeysockets/baileys';

// const { fetchProfilePictureUrl } = pkg;
// const MessageType = pkg.MessageType || pkg['MessageType'] || pkg.default?.MessageType;

// // Array para armazenar mensagens de promoção
// let promotionMessages = [];

// // Defina seu número de WhatsApp
// const yourNumber = '558599495181@s.whatsapp.net';

// // Função para lidar com atualizações de participantes de grupo
// export async function handleGroupParticipantsUpdate(c, update, botInfo) {
//     console.log('Update recebido:', update);

//     if (update.action === 'promote' && update.participants.length >= 1) {
//         const adminPromoted = update.participants[0];
//         const adminWhoPromoted = update.author;

//         const message = `✅ O usuário @${adminPromoted.split('@')[0]} foi promovido a administrador do grupo 👏🍻 *DﾑMﾑS* 💃🔥 *Dﾑ* *NIGӇԵ*💃🎶🍾🍸 por @${adminWhoPromoted.split('@')[0]}.`;

//         await c.sendMessage(yourNumber, {
//             text: message,
//             mentions: [adminPromoted, adminWhoPromoted],
//             quoted: null
//         });

//         promotionMessages.push({
//             id: update.id,
//             message: message,
//             promotedBy: adminWhoPromoted,
//             promotedUser: adminPromoted
//         });

//         console.log('Mensagem armazenada:', {
//             id: update.id,
//             message: message,
//             promotedBy: adminWhoPromoted,
//             promotedUser: adminPromoted
//         });

//     } else if (update.action === 'demote' && update.participants.length >= 1) {
//         const adminDemoted = update.participants[0];
//         const adminWhoDemoted = update.author;

//         const message = `❌ O usuário @${adminDemoted.split('@')[0]} foi rebaixado de administrador do grupo 👏🍻 *DﾑMﾑS* 💃🔥 *Dﾑ* *NIGӇԵ*💃🎶🍾🍸 por @${adminWhoDemoted.split('@')[0]}.`;

//         await c.sendMessage(yourNumber, {
//             text: message,
//             mentions: [adminDemoted, adminWhoDemoted],
//             quoted: null
//         });

//         console.log('Mensagem de rebaixamento enviada:', message);
//     } else if (update.action === 'add' && update.participants.length >= 1) {
//         const userAdded = update.participants[0];
//         const adminWhoAdded = update.author;

//         // Obter a foto de perfil do usuário adicionado
//         let profilePic;
//         try {
//             profilePic = await c.profilePictureUrl(userAdded, 'image');
//         } catch (error) {
//             console.log('Erro ao obter a foto de perfil:', error);
//             profilePic = 'default-profile-pic-url'; // URL padrão caso não consiga obter a foto
//         }

//         const message = `👋 O usuário @${userAdded.split('@')[0]} foi adicionado ao grupo por @${adminWhoAdded.split('@')[0]}.`;

//         // Enviar a foto de perfil com a mensagem
//         await c.sendMessage(yourNumber, {
//             image: { url: profilePic },
//             caption: message,
//             mentions: [userAdded, adminWhoAdded],
//             quoted: null
//         });

//         console.log('Notificação de adição enviada:', message);
//     } else if (update.action === 'remove' && update.participants.length >= 1) {
//         const userRemoved = update.participants[0];
//         const adminWhoRemoved = update.author;

//         // Obter a foto de perfil do usuário removido
//         let profilePic;
//         try {
//             profilePic = await c.profilePictureUrl(userRemoved, 'image');
//         } catch (error) {
//             console.log('Erro ao obter a foto de perfil:', error);
//             profilePic = 'default-profile-pic-url'; // URL padrão caso não consiga obter a foto
//         }

//         const message = `👋 O usuário @${userRemoved.split('@')[0]} foi removido do grupo por @${adminWhoRemoved.split('@')[0]}.`;

//         // Enviar a foto de perfil com a mensagem
//         await c.sendMessage(yourNumber, {
//             image: { url: profilePic },
//             caption: message,
//             mentions: [userRemoved, adminWhoRemoved],
//             quoted: null
//         });

//         console.log('Notificação de remoção enviada:', message);
//     } else {
//         console.log('Ação não é uma promoção, rebaixamento, adição ou remoção, ou participantes insuficientes.');
//     }
// }

// avisoadm.js
import pkg from '@whiskeysockets/baileys';

const { fetchProfilePictureUrl } = pkg;
const MessageType = pkg.MessageType || pkg['MessageType'] || pkg.default?.MessageType;

// Array para armazenar mensagens de promoção
let promotionMessages = [];

// Defina seus números de WhatsApp
const yourNumbers = [
    '558599495181@s.whatsapp.net',
    '5585996603268@s.whatsapp.net',
    '558396805283@s.whatsapp.net',
    '558398759516@s.whatsapp.net'
];

// Função para lidar com atualizações de participantes de grupo
export async function handleGroupParticipantsUpdate(c, update, botInfo) {
    console.log('Update recebido:', update);

    if (update.action === 'promote' && update.participants.length >= 1) {
        const adminPromoted = update.participants[0];
        const adminWhoPromoted = update.author;

        const message = `✅ O usuário @${adminPromoted.split('@')[0]} foi promovido a administrador do grupo 👏🍻 *DﾑMﾑS* 💃🔥 *Dﾑ* *NIGӇԵ*💃🎶🍾🍸 por @${adminWhoPromoted.split('@')[0]}.`;

        for (const number of yourNumbers) {
            await c.sendMessage(number, {
                text: message,
                mentions: [adminPromoted, adminWhoPromoted],
                quoted: null
            });
        }

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

        const message = `❌ O usuário @${adminDemoted.split('@')[0]} foi rebaixado de administrador do grupo 👏🍻 *DﾑMﾑS* 💃🔥 *Dﾑ* *NIGӇԵ*💃🎶🍾🍸 por @${adminWhoDemoted.split('@')[0]}.`;

        for (const number of yourNumbers) {
            await c.sendMessage(number, {
                text: message,
                mentions: [adminDemoted, adminWhoDemoted],
                quoted: null
            });
        }

        console.log('Mensagem de rebaixamento enviada:', message);
    } else if (update.action === 'add' && update.participants.length >= 1) {
        const userAdded = update.participants[0];
        const adminWhoAdded = update.author;

        // Obter a foto de perfil do usuário adicionado
        let profilePic;
        try {
            profilePic = await c.profilePictureUrl(userAdded, 'image');
        } catch (error) {
            console.log('Erro ao obter a foto de perfil:', error);
            profilePic = 'default-profile-pic-url'; // URL padrão caso não consiga obter a foto
        }

        const message = `👋 O usuário @${userAdded.split('@')[0]} foi adicionado ao grupo por @${adminWhoAdded.split('@')[0]}.`;

        // Enviar a foto de perfil com a mensagem
        for (const number of yourNumbers) {
            await c.sendMessage(number, {
                image: { url: profilePic },
                caption: message,
                mentions: [userAdded, adminWhoAdded],
                quoted: null
            });
        }

        console.log('Notificação de adição enviada:', message);
    } else if (update.action === 'remove' && update.participants.length >= 1) {
        const userRemoved = update.participants[0];
        const adminWhoRemoved = update.author;

        // Obter a foto de perfil do usuário removido
        let profilePic;
        try {
            profilePic = await c.profilePictureUrl(userRemoved, 'image');
        } catch (error) {
            console.log('Erro ao obter a foto de perfil:', error);
            profilePic = 'default-profile-pic-url'; // URL padrão caso não consiga obter a foto
        }

        const message = `👋 O usuário @${userRemoved.split('@')[0]} foi removido do grupo por @${adminWhoRemoved.split('@')[0]}.`;

        // Enviar a foto de perfil com a mensagem
        for (const number of yourNumbers) {
            await c.sendMessage(number, {
                image: { url: profilePic },
                caption: message,
                mentions: [userRemoved, adminWhoRemoved],
                quoted: null
            });
        }

        console.log('Notificação de remoção enviada:', message);
    } else {
        console.log('Ação não é uma promoção, rebaixamento, adição ou remoção, ou participantes insuficientes.');
    }
}

