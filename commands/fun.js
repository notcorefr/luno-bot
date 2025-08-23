const { SlashCommandBuilder } = require('discord.js');

const commands = [
    {
        name: 'hug',
        description: 'Give someone a hug',
        execute(message, args) {
            const target = message.mentions.users.first() || message.author;
            const targetName = target.id === message.author.id ? 'themselves' : target.username;
            message.reply(`${message.author.username} gives ${targetName} a warm hug!`);
        }
    },
    {
        name: 'kick',
        description: 'Playfully kick someone',
        execute(message, args) {
            const target = message.mentions.users.first() || message.author;
            const targetName = target.id === message.author.id ? 'themselves' : target.username;
            message.reply(`${message.author.username} playfully kicks ${targetName}!`);
        }
    },
    {
        name: 'punch',
        description: 'Playfully punch someone',
        execute(message, args) {
            const target = message.mentions.users.first() || message.author;
            const targetName = target.id === message.author.id ? 'themselves' : target.username;
            message.reply(`${message.author.username} playfully punches ${targetName}!`);
        }
    },
    {
        name: 'kill',
        description: 'Playfully eliminate someone',
        execute(message, args) {
            const target = message.mentions.users.first() || message.author;
            const targetName = target.id === message.author.id ? 'themselves' : target.username;
            message.reply(`${message.author.username} playfully eliminates ${targetName} from the game!`);
        }
    },
    {
        name: 'happy',
        description: 'Show that you are happy',
        execute(message, args) {
            message.reply(`${message.author.username} is feeling very happy today!`);
        }
    }
];

const slashCommands = [
    {
        data: new SlashCommandBuilder()
            .setName('hug')
            .setDescription('Give someone a hug')
            .addUserOption(option =>
                option.setName('target')
                    .setDescription('The user to hug')
                    .setRequired(false)),
        async execute(interaction) {
            const target = interaction.options.getUser('target') || interaction.user;
            const targetName = target.id === interaction.user.id ? 'themselves' : target.username;
            await interaction.reply(`${interaction.user.username} gives ${targetName} a warm hug!`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('kick')
            .setDescription('Playfully kick someone')
            .addUserOption(option =>
                option.setName('target')
                    .setDescription('The user to kick')
                    .setRequired(false)),
        async execute(interaction) {
            const target = interaction.options.getUser('target') || interaction.user;
            const targetName = target.id === interaction.user.id ? 'themselves' : target.username;
            await interaction.reply(`${interaction.user.username} playfully kicks ${targetName}!`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('punch')
            .setDescription('Playfully punch someone')
            .addUserOption(option =>
                option.setName('target')
                    .setDescription('The user to punch')
                    .setRequired(false)),
        async execute(interaction) {
            const target = interaction.options.getUser('target') || interaction.user;
            const targetName = target.id === interaction.user.id ? 'themselves' : target.username;
            await interaction.reply(`${interaction.user.username} playfully punches ${targetName}!`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('kill')
            .setDescription('Playfully eliminate someone')
            .addUserOption(option =>
                option.setName('target')
                    .setDescription('The user to eliminate')
                    .setRequired(false)),
        async execute(interaction) {
            const target = interaction.options.getUser('target') || interaction.user;
            const targetName = target.id === interaction.user.id ? 'themselves' : target.username;
            await interaction.reply(`${interaction.user.username} playfully eliminates ${targetName} from the game!`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('happy')
            .setDescription('Show that you are happy'),
        async execute(interaction) {
            await interaction.reply(`${interaction.user.username} is feeling very happy today!`);
        }
    }
];

module.exports = { commands, slashCommands };