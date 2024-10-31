// index.js

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
import { handleMessage } from './bot/baileys/advertenciaGrupos.js';
import { mencionarTodos } from './bot/baileys/marcarTodosGrupo.js';
import { removerCaracteres } from './bot/baileys/removerCaracteres.js';

// Definindo o fuso horário
moment.tz.setDefault('America/Sao_Paulo');

// Cache de tentativas de envios
const cacheTentativasEnvio = new NodeCache();

async function connectToWhatsApp() {
    let inicializacaoCompleta = false;
    const eventosEsperando = [];
    const { state: estadoAuth, saveCreds } = await useMultiFileAuthState('sessao');
    const { version: versaoWaWeb } = await fetchLatestBaileysVersion();
    const c = makeWASocket(configSocket(estadoAuth, cacheTentativasEnvio, versaoWaWeb));
    const bot = new BotControle();

    // Limpando mensagens armazenadas da sessão anterior
    await new MensagemControle().limparMensagensArmazenadas();

    // Escutando novos eventos
    c.ev.process(async (events) => {
        const botInfo = await bot.obterInformacoesBot();

        try {
            // Atualização na conexão
            if (events['connection.update']) {
                const update = events['connection.update'];
                const { connection } = update;

                if (connection === 'open') {
                    await eventosSocket.conexaoAberta(c, botInfo);
                    inicializacaoCompleta = await eventosSocket.atualizacaoDadosGrupos(c, botInfo);
                    await eventosSocket.realizarEventosEspera(c, eventosEsperando);
                } else if (connection === 'close') {
                    const necessarioReconectar = await eventosSocket.conexaoEncerrada(update, botInfo);
                    if (necessarioReconectar) connectToWhatsApp();
                }
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

                    for (const mensagem of m.messages) {
                        await removerCaracteres(c, mensagem);
                        await handleMessage(c, mensagem);
                        await mencionarTodos(c, mensagem);

                        if (mensagem.message?.videoMessage) {
                            await monitorVideos(c, mensagem);
                        }
                    }
                } else {
                    eventosEsperando.push({ evento: 'messages.upsert', dados: m });
                }
            }

            // Atualização de participantes de grupos
            if (events['group-participants.update']) {
                const atualizacao = events['group-participants.update'];
                console.log('Evento de atualização de participantes recebido:', atualizacao);
                if (inicializacaoCompleta) {
                    await handleGroupParticipantsUpdate(c, atualizacao, botInfo);
                    const { action, participants, id } = atualizacao;

                    // Obter metadados do grupo para encontrar os administradores
                    const groupMetadata = await c.groupMetadata(id);
                    const adminList = groupMetadata.participants
                        .filter(participant => participant.admin)
                        .map(admin => admin.id);

                    // Notificar administradores sobre as mudanças nos participantes
                    for (const membro of participants) {
                        if (action === 'add') {
                            // Notifique sobre um novo membro adicionado, se necessário
                        } else if (action === 'remove') {
                            // Notifique sobre um membro removido, se necessário
                        } else if (action === 'leave') {
                            // Notifique sobre um membro que saiu
                        }
                    }
                } else {
                    eventosEsperando.push({ evento: 'group-participants.update', dados: atualizacao });
                }
            }
        } catch (error) {
            console.error('Erro ao processar eventos:', error);
        }
    });

    c.ev.on('messages.reaction', async (reaction) => {
        console.log('Reação recebida:', reaction);
        await eventosSocket.reagirMensagem(c, reaction);
    });

    c.ev.on('chats.set', async (chats) => {
        console.log('Conjunto de chats atualizado:', chats);
    });
}

// Conectar ao WhatsApp
connectToWhatsApp();
