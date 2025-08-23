const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const commands = [
    {
        name: 'serverinfo',
        description: 'Get information about the server',
        execute(message, args) {
            const guild = message.guild;
            const embed = new EmbedBuilder()
                .setTitle('Server Information')
                .addFields(
                    { name: 'Server Name', value: guild.name, inline: true },
                    { name: 'Member Count', value: guild.memberCount.toString(), inline: true },
                    { name: 'Created', value: guild.createdAt.toDateString(), inline: true }
                )
                .setColor(0x0099FF)
                .setTimestamp();
            
            message.reply({ embeds: [embed] });
        }
    },
    {
        name: 'membercount',
        description: 'Get the member count of the server',
        execute(message, args) {
            message.reply(`This server has ${message.guild.memberCount} members.`);
        }
    },
    {
        name: 'userinfo',
        description: 'Get information about a user',
        execute(message, args) {
            const target = message.mentions.users.first() || message.author;
            const member = message.guild.members.cache.get(target.id);
            
            const embed = new EmbedBuilder()
                .setTitle('User Information')
                .addFields(
                    { name: 'Username', value: target.username, inline: true },
                    { name: 'User ID', value: target.id, inline: true },
                    { name: 'Account Created', value: target.createdAt.toDateString(), inline: true }
                )
                .setColor(0x0099FF)
                .setTimestamp();
            
            if (member) {
                embed.addFields(
                    { name: 'Joined Server', value: member.joinedAt.toDateString(), inline: true }
                );
            }
            
            message.reply({ embeds: [embed] });
        }
    },
    {
        name: 'help',
        description: 'Show all available commands',
        execute(message, args) {
            const embed = new EmbedBuilder()
                .setTitle('Bot Commands')
                .setDescription('Here are all the available commands:')
                .addFields(
                    { name: 'Fun Commands', value: '`!hug` - Give someone a hug\n`!kick` - Playfully kick someone\n`!punch` - Playfully punch someone\n`!kill` - Playfully eliminate someone\n`!happy` - Show that you are happy\n`!kiss` - Give someone a kiss', inline: false },
                    { name: 'Utility Commands', value: '`!serverinfo` - Get server information\n`!membercount` - Get member count\n`!userinfo` - Get user information\n`!afk` - Mark yourself as AFK', inline: false },
                    { name: 'Invite Bot', value: `[Click here to invite me to your server!](https://discord.com/api/oauth2/authorize?client_id=${message.client.user.id}&permissions=268435456&scope=bot%20applications.commands)`, inline: false }
                )
                .setColor(0x0099FF)
                .setFooter({ text: 'You can also use slash commands by typing / and selecting the command!' })
                .setTimestamp();
            
            message.reply({ embeds: [embed] });
        }
    }
];

const slashCommands = [
    {
        data: new SlashCommandBuilder()
            .setName('serverinfo')
            .setDescription('Get information about the server'),
        async execute(interaction) {
            const guild = interaction.guild;
            const embed = new EmbedBuilder()
                .setTitle('Server Information')
                .addFields(
                    { name: 'Server Name', value: guild.name, inline: true },
                    { name: 'Member Count', value: guild.memberCount.toString(), inline: true },
                    { name: 'Created', value: guild.createdAt.toDateString(), inline: true }
                )
                .setColor(0x0099FF)
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('membercount')
            .setDescription('Get the member count of the server'),
        async execute(interaction) {
            await interaction.reply(`This server has ${interaction.guild.memberCount} members.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('userinfo')
            .setDescription('Get information about a user')
            .addUserOption(option =>
                option.setName('target')
                    .setDescription('The user to get information about')
                    .setRequired(false)),
        async execute(interaction) {
            const target = interaction.options.getUser('target') || interaction.user;
            const member = interaction.guild.members.cache.get(target.id);
            
            const embed = new EmbedBuilder()
                .setTitle('User Information')
                .addFields(
                    { name: 'Username', value: target.username, inline: true },
                    { name: 'User ID', value: target.id, inline: true },
                    { name: 'Account Created', value: target.createdAt.toDateString(), inline: true }
                )
                .setColor(0x0099FF)
                .setTimestamp();
            
            if (member) {
                embed.addFields(
                    { name: 'Joined Server', value: member.joinedAt.toDateString(), inline: true }
                );
            }
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('help')
            .setDescription('Show all available commands'),
        async execute(interaction) {
            const embed = new EmbedBuilder()
                .setTitle('Bot Commands')
                .setDescription('Here are all the available commands:')
                .addFields(
                    { name: 'Fun Commands', value: '`/hug` - Give someone a hug\n`/kick` - Playfully kick someone\n`/punch` - Playfully punch someone\n`/kill` - Playfully eliminate someone\n`/happy` - Show that you are happy\n`/kiss` - Give someone a kiss', inline: false },
                    { name: 'Utility Commands', value: '`/serverinfo` - Get server information\n`/membercount` - Get member count\n`/userinfo` - Get user information\n`/afk` - Mark yourself as AFK', inline: false },
                    { name: 'Invite Bot', value: `[Click here to invite me to your server!](https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=268435456&scope=bot%20applications.commands)`, inline: false }
                )
                .setColor(0x0099FF)
                .setFooter({ text: 'You can also use prefix commands by typing ! before the command name!' })
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        }
    }
];

module.exports = { commands, slashCommands };