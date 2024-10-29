// REQUERINDO MODULOS
import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import * as eventosSocket from './bot/baileys/eventosSocket.js';
import { BotControle } from './bot/controles/BotControle.js';
import { MensagemControle } from './bot/controles/MensagemControle.js';
import configSocket from './bot/baileys/configSocket.js';
import moment from 'moment-timezone';
import NodeCache from 'node-cache';
import { handleGroupParticipantsUpdate } from './bot/baileys/avisoadm.js';
import removerNumEstrangeiros from './bot/baileys/removerNumEstranjeiros.js';
import { monitorVideos } from './bot/baileys/videoMonitor.js';
import { onParticipanteSaiu } from './bot/baileys/usuarioSaiu.js';

// Definindo o fuso horário
moment.tz.setDefault('America/Sao_Paulo');

// Cache de tentativas de envios
const cacheTentativasEnvio = new NodeCache();

async function connectToWhatsApp() {
    let inicializacaoCompleta = false, eventosEsperando = [];
    const { state: estadoAuth, saveCreds } = await useMultiFileAuthState('sessao');
    let { version: versaoWaWeb } = await fetchLatestBaileysVersion();
    const c = makeWASocket(configSocket(estadoAuth, cacheTentativasEnvio, versaoWaWeb));
    const bot = new BotControle();

    // Limpando mensagens armazenadas da sessão anterior
    await new MensagemControle().limparMensagensArmazenadas();

    // Escutando novos eventos
    c.ev.process(async (events) => {
        // Obtendo dados do bot
        const botInfo = await bot.obterInformacoesBot();

        // Atualização na conexão
        if (events['connection.update']) {
            const update = events['connection.update'];
            const { connection } = update;
            let necessarioReconectar = false;
            if (connection === 'open') {
                await eventosSocket.conexaoAberta(c, botInfo);
                inicializacaoCompleta = await eventosSocket.atualizacaoDadosGrupos(c, botInfo);
                await eventosSocket.realizarEventosEspera(c, eventosEsperando);
            } else if (connection === 'close') {
                necessarioReconectar = await eventosSocket.conexaoEncerrada(update, botInfo);
            }
            if (necessarioReconectar) connectToWhatsApp();
        }

        // Atualização nas credenciais
        if (events['creds.update']) {
            await saveCreds();
        }

        // Ao receber novas mensagens
        if (events['messages.upsert']) {
            const m = events['messages.upsert'];
            if (inicializacaoCompleta) {
                await eventosSocket.receberMensagem(c, m, botInfo);
                
                // Monitorar vídeos nas mensagens recebidas
                for (const message of m.messages) {
                    await monitorVideos(c, message);
                }
            } else {
                eventosEsperando.push({ evento: 'messages.upsert', dados: m });
            }
        }

        // Ao haver mudanças nos participantes de um grupo
        if (events['group-participants.update']) {
            const atualizacao = events['group-participants.update'];
            if (inicializacaoCompleta) {
                await handleGroupParticipantsUpdate(c, atualizacao, botInfo);

                // Chamar a função para remover números estrangeiros
                const groupId = atualizacao.id; // Obtém o ID do grupo da atualização
                await removerNumEstrangeiros(c, groupId);

                // Notificar a saída do membro
                for (const membro of atualizacao.participants) {
                    if (atualizacao.action === 'remove') {
                        await onParticipanteSaiu(c, groupId, membro); // Notifica a saída do membro
                    }
                }
            } else {
                eventosEsperando.push({ evento: 'group-participants.update', dados: atualizacao });
            }
        }

        // Ao ser adicionado em novos grupos
        if (events['groups.upsert']) {
            const grupo = events['groups.upsert'];
            if (inicializacaoCompleta) {
                await eventosSocket.adicionadoEmGrupo(c, grupo, botInfo);
            } else {
                eventosEsperando.push({ evento: 'groups.upsert', dados: grupo });
            }
        }

        // Ao atualizar dados do grupo
        if (events['groups.update']) {
            const grupos = events['groups.update'];
            if (grupos.length === 1 && grupos[0].participants === undefined) {
                if (inicializacaoCompleta) {
                    await eventosSocket.atualizacaoDadosGrupo(grupos[0]);
                } else {
                    eventosEsperando.push({ evento: 'groups.update', dados: grupos });
                }
            }
        }
    });
}

// Execução principal
connectToWhatsApp().catch(error => {
    console.error('Erro na conexão com o WhatsApp:', error);
});
