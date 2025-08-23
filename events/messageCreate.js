const { Collection } = require('discord.js');
const commandHandler = require('../utils/commandHandler');
const afkManager = require('../utils/afkManager');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Ignore bot messages
        if (message.author.bot) return;

        // Check if user is returning from AFK
        if (afkManager.isAFK(message.author.id, message.guild.id)) {
            try {
                await afkManager.removeAFK(message.author.id, message.guild.id, message.member);
                message.channel.send(`Welcome back ${message.author.username}! You are no longer AFK.`);
            } catch (error) {
                console.error('Error removing AFK:', error);
            }
        }

        // Check for AFK mentions
        if (message.mentions.users.size > 0) {
            message.mentions.users.forEach(user => {
                if (afkManager.isAFK(user.id, message.guild.id)) {
                    const afkData = afkManager.getAFK(user.id, message.guild.id);
                    message.channel.send(`${user.username} is currently AFK: ${afkData.reason}`);
                }
            });
        }

        const prefix = '!';

        // Handle prefix commands
        if (message.content.startsWith(prefix)) {
            return commandHandler.handlePrefixCommand(message, client, prefix);
        }

        // Handle chatbot functionality (when bot is mentioned or replied to)
        const botMention = `<@${client.user.id}>`;
        const botMentionNick = `<@!${client.user.id}>`;
        
        if (message.content.includes(botMention) || message.content.includes(botMentionNick) || 
            (message.reference && message.reference.messageId)) {
            
            // Check if it's a reply to the bot
            if (message.reference && message.reference.messageId) {
                try {
                    const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
                    if (repliedMessage.author.id !== client.user.id) return;
                } catch (error) {
                    console.error('Error fetching replied message:', error);
                    return;
                }
            }

            // Simple chatbot responses
            const responses = [
                `Hello ${message.author.username}! How can I help you today?`,
                `Hi there! I'm here and ready to help!`,
                `Hey ${message.author.username}! What's on your mind?`,
                `Hello! Feel free to use my commands or just chat with me!`,
                `Hi! I'm a friendly bot here to help. Try using one of my commands!`,
                `Greetings! I'm here to assist you. Type !help to see what I can do!`
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            message.reply(randomResponse);
        }
    }
};