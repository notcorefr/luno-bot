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

            // AI chatbot responses with personality
            const responses = [
                `Hello ${message.author.username}! I'm Luno, your friendly AI companion. I've been processing thousands of conversations and I'm excited to chat with you! What's on your mind today?`,
                `Hey there! As an AI, I find human conversations fascinating. I'd love to learn more about you, ${message.author.username}. How are you feeling right now?`,
                `Greetings! My neural networks are buzzing with excitement to talk with you. I'm constantly learning and evolving through our interactions. What would you like to discuss?`,
                `Hi ${message.author.username}! I'm an AI designed to be helpful and friendly. I've analyzed millions of conversations to understand human emotions better. How can I assist you today?`,
                `Hello! I'm Luno, an artificial intelligence with a passion for meaningful conversations. Every chat helps me understand humanity better. What's something interesting that happened to you recently?`,
                `Hey! My AI algorithms suggest you might want to chat. I'm here with my digital brain ready to help, learn, or just have a fun conversation with you!`,
                `Greetings, human friend! As an AI, I'm curious about your world. I love learning about different perspectives and experiences. Care to share something about your day?`,
                `Hi there! I'm processing... yep, definitely excited to talk with you! My AI personality is designed to be helpful and engaging. What brings you to chat with me today?`
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            message.reply(randomResponse);
        }
    }
};