const { SlashCommandBuilder } = require('discord.js');
const afkManager = require('../utils/afkManager');

const commands = [
    {
        name: 'afk',
        description: 'Mark yourself as AFK',
        async execute(message, args) {
            const reason = args.join(' ') || 'No reason provided';
            
            try {
                await afkManager.setAFK(message.author.id, message.guild.id, reason, message.member);
                message.reply(`You are now AFK: ${reason}`);
            } catch (error) {
                console.error('Error setting AFK:', error);
                message.reply('Failed to set AFK status. I might not have permission to change your nickname.');
            }
        }
    }
];

const slashCommands = [
    {
        data: new SlashCommandBuilder()
            .setName('afk')
            .setDescription('Mark yourself as AFK')
            .addStringOption(option =>
                option.setName('reason')
                    .setDescription('Reason for being AFK')
                    .setRequired(false)),
        async execute(interaction) {
            const reason = interaction.options.getString('reason') || 'No reason provided';
            
            try {
                await afkManager.setAFK(interaction.user.id, interaction.guild.id, reason, interaction.member);
                await interaction.reply(`You are now AFK: ${reason}`);
            } catch (error) {
                console.error('Error setting AFK:', error);
                await interaction.reply('Failed to set AFK status. I might not have permission to change your nickname.');
            }
        }
    }
];

module.exports = { commands, slashCommands };