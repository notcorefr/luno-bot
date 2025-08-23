const { Collection } = require('discord.js');
const commandHandler = require('../utils/commandHandler');
const afkManager = require('../utils/afkManager');
const aiChatbot = require('../utils/aiChatbot');

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

            // Extract the user's message without mentions
            let userMessage = message.content
                .replace(botMention, '')
                .replace(botMentionNick, '')
                .trim();
            
            // If message is empty after removing mentions, use a default
            if (!userMessage) {
                userMessage = "Hello!";
            }
            
            // Show typing indicator
            message.channel.sendTyping();
            
            try {
                // Generate AI response
                const aiResponse = await aiChatbot.generateResponse(message, userMessage);
                message.reply(aiResponse);
            } catch (error) {
                console.error('Error with AI chatbot:', error);
                // Fallback to simple responses if AI fails
                const fallbackResponses = [
                    `Hello ${message.author.username}! I'm Luno, your friendly AI companion. How can I help you today?`,
                    `Hi there! My AI brain is processing your message. What would you like to chat about?`,
                    `Hey ${message.author.username}! I'm here and ready to have a conversation with you!`
                ];
                const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
                message.reply(randomResponse);
            }
        }
    }
};