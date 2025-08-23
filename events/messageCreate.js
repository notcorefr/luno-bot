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
        try{
            
        if (message.content.startsWith(prefix)) {
            return commandHandler.handlePrefixCommand(message, client, prefix);
        }
        }catch(err){
            console.err(err);
            return message.reply('There was a error while executing that command.');
        }

    }
};