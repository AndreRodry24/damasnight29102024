// Função para registrar erros no console
function consoleErro(err, mensagem) {
    console.error(mensagem, err);
}

// Função para notificar a saída de um membro com resumo das informações
export async function onParticipanteSaiu(client, id_chat, membro) {
    try {
        console.log(`Tentando obter informações do grupo para o ID: ${id_chat}`);
        
        // Obtém informações do grupo
        const grupo = await client.groupMetadata(id_chat);
        const { participants } = grupo;
        const admins = participants.filter(p => p.admin); // Filtra os administradores

        // Obtém nome e foto do membro
        const nomeMembro = membro.split('@')[0]; // Obtém o ID sem o domínio
        console.log(`Nome do membro: ${nomeMembro}`);

        // Obtém a foto de perfil do membro usando profilePictureUrl
        let fotoPerfilUrl;
        try {
            fotoPerfilUrl = await client.profilePictureUrl(membro, 'image'); // Usa o método profilePictureUrl
            console.log(`URL da foto de perfil: ${fotoPerfilUrl}`);
        } catch (err) {
            consoleErro(err, "Não foi possível obter a foto de perfil do membro");
            fotoPerfilUrl = null; // Define como null se a foto não for encontrada
        }

        // Mensagem a ser enviada
        const mensagem = `@${nomeMembro} saiu do grupo.`;

        // Envia a mensagem e a foto para os administradores
        for (const admin of admins) {
            console.log(`Enviando mensagem para o administrador: ${admin.id}`);
            await client.sendMessage(admin.id, { 
                text: mensagem, 
                mentions: [membro] // Menciona o membro que saiu
            });

            if (fotoPerfilUrl) {
                await client.sendMessage(admin.id, { 
                    image: { url: fotoPerfilUrl }, 
                    caption: `Foto de perfil de @${nomeMembro}`, 
                    mentions: [membro] // Também menciona o membro na foto
                });
            }
        }
    } catch (err) {
        consoleErro(err, "Erro ao notificar saída de membro");
    }
}
