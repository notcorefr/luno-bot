const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// Helper function to determine user status
function getUserStatus(member) {
    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
        return 'Administrator';
    } else if (member.permissions.has(PermissionFlagsBits.ManageGuild)) {
        return 'Manager';
    } else if (member.permissions.has(PermissionFlagsBits.ModerateMembers) || member.permissions.has(PermissionFlagsBits.BanMembers) || member.permissions.has(PermissionFlagsBits.KickMembers)) {
        return 'Moderator';
    } else if (member.permissions.has(PermissionFlagsBits.ManageMessages) || member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return 'Staff';
    } else {
        return 'Member';
    }
}

// Helper function to check for dangerous permissions
function hasDangerousPermissions(member) {
    const dangerousPerms = [
        PermissionFlagsBits.Administrator,
        PermissionFlagsBits.ManageGuild,
        PermissionFlagsBits.BanMembers,
        PermissionFlagsBits.KickMembers,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ManageRoles,
        PermissionFlagsBits.ManageWebhooks,
        PermissionFlagsBits.MentionEveryone
    ];
    
    return dangerousPerms.some(perm => member.permissions.has(perm));
}

const commands = [
    {
        name: 'serverinfo',
        aliases: ['si'],
        description: 'Get information about the server',
        async execute(message, args) {
            const guild = message.guild;
            const embed = new EmbedBuilder()
                .setTitle(`${guild.name} - Server Information`)
                .addFields(
                    { name: 'Server Name', value: guild.name, inline: true },
                    { name: 'Member Count', value: guild.memberCount.toString(), inline: true },
                    { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
                    { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                    { name: 'Boost Level', value: guild.premiumTier.toString(), inline: true },
                    { name: 'Boost Count', value: guild.premiumSubscriptionCount?.toString() || '0', inline: true }
                )
                .setColor(0x0099FF)
                .setTimestamp();
            
            // Set server icon
            if (guild.iconURL()) {
                embed.setThumbnail(guild.iconURL({ dynamic: true, size: 256 }));
            }
            
            // Set server banner
            if (guild.bannerURL()) {
                embed.setImage(guild.bannerURL({ dynamic: true, size: 1024 }));
            }
            
            message.reply({ embeds: [embed] });
        }
    },
    {
        name: 'membercount',
        aliases: ['mc'],
        description: 'Get the member count of the server',
        execute(message, args) {
            message.reply(`This server has ${message.guild.memberCount} members.`);
        }
    },
    {
        name: 'userinfo',
        aliases: ['ui'],
        description: 'Get information about a user',
        async execute(message, args) {
            const target = message.mentions.users.first() || message.author;
            const member = message.guild.members.cache.get(target.id);
            
            const embed = new EmbedBuilder()
                .setTitle(`${target.username} - User Information`)
                .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 256 }))
                .addFields(
                    { name: 'Username', value: target.username, inline: true },
                    { name: 'User ID', value: target.id, inline: true },
                    { name: 'Account Created', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:F>`, inline: true }
                )
                .setColor(0x0099FF)
                .setTimestamp();
            
            if (member) {
                const userStatus = getUserStatus(member);
                const hasDangerous = hasDangerousPermissions(member);
                const roles = member.roles.cache
                    .filter(role => role.id !== message.guild.id)
                    .sort((a, b) => b.position - a.position)
                    .map(role => role.toString())
                    .slice(0, 10);
                
                embed.addFields(
                    { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
                    { name: 'Status', value: userStatus, inline: true },
                    { name: 'Dangerous Permissions', value: hasDangerous ? 'Yes' : 'No', inline: true }
                );
                
                if (roles.length > 0) {
                    embed.addFields({ 
                        name: `Roles (${member.roles.cache.size - 1})`, 
                        value: roles.length === 10 ? roles.join(', ') + '...' : roles.join(', '), 
                        inline: false 
                    });
                }
            }
            
            message.reply({ embeds: [embed] });
        }
    },
    {
        name: 'clearchat',
        description: 'Clear your AI conversation history',
        execute(message, args) {
            const aiChatbot = require('../utils/aiChatbot');
            aiChatbot.clearHistory(message.author.id);
            message.reply('Your AI conversation history has been cleared! Our next chat will start fresh.');
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
                    { name: 'Fun Commands', value: '`!help` - to view all existing commands\n`!hug` - Give someone a hug\n`!kick` - Playfully kick someone\n`!punch` - Playfully punch someone\n`!kill` - Playfully eliminate someone\n`!happy` - Show that you are happy\n`!kiss` - Give someone a kiss\n`!cry` - Show that you are crying\n`!laugh` - Show that you are laughing\n`!dance` - Show your dance moves\n`!twerk` - Show your twerking skills', inline: false },
                    { name: 'Utility Commands', value: '`!serverinfo` (`!si`) - Get server information\n`!membercount` (`!mc`) - Get member count\n`!userinfo` (`!ui`) - Get user information\n`!afk` - Mark yourself as AFK\n`!av @user` - to view someones avatar', inline: false },
                    { name: 'AI Chatbot', value: 'Join Our Main Server and look for "Iuno chat" and you can chat with me there :3', inline: false },
                    { name: 'Invite Bot', value: `[Click here to invite me to your server!](https://discord.com/api/oauth2/authorize?client_id=${message.client.user.id}&permissions=268435456&scope=bot%20applications.commands)`, inline: false }
                )
                .setColor(0x0099FF)
                .setFooter({ text: 'You can also use slash commands by typing / and selecting the command!' })
                .setTimestamp();
            
            message.reply({ embeds: [embed] });
        }
    },
    {
        name: 'avatar',
        aliases: ['av'],
        description: 'Display a user\'s avatar and basic information',
        async execute(message, args) {
            // Get the target user (either mentioned user or the message author)
            const user = message.mentions.users.first() || message.author;
            const member = message.guild.members.cache.get(user.id);

            const embed = new EmbedBuilder()
                .setTitle(`${user.tag}'s Avatar`)
                .setColor(0x0099FF)
                .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
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
                .setTitle(`${guild.name} - Server Information`)
                .addFields(
                    { name: 'Server Name', value: guild.name, inline: true },
                    { name: 'Member Count', value: guild.memberCount.toString(), inline: true },
                    { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
                    { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                    { name: 'Boost Level', value: guild.premiumTier.toString(), inline: true },
                    { name: 'Boost Count', value: guild.premiumSubscriptionCount?.toString() || '0', inline: true }
                )
                .setColor(0x0099FF)
                .setTimestamp();
            
            // Set server icon
            if (guild.iconURL()) {
                embed.setThumbnail(guild.iconURL({ dynamic: true, size: 256 }));
            }
            
            // Set server banner
            if (guild.bannerURL()) {
                embed.setImage(guild.bannerURL({ dynamic: true, size: 1024 }));
            }
            
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
                .setTitle(`${target.username} - User Information`)
                .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 256 }))
                .addFields(
                    { name: 'Username', value: target.username, inline: true },
                    { name: 'User ID', value: target.id, inline: true },
                    { name: 'Account Created', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:F>`, inline: true }
                )
                .setColor(0x0099FF)
                .setTimestamp();
            
            if (member) {
                const userStatus = getUserStatus(member);
                const hasDangerous = hasDangerousPermissions(member);
                const roles = member.roles.cache
                    .filter(role => role.id !== interaction.guild.id)
                    .sort((a, b) => b.position - a.position)
                    .map(role => role.toString())
                    .slice(0, 10);
                
                embed.addFields(
                    { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
                    { name: 'Status', value: userStatus, inline: true },
                    { name: 'Dangerous Permissions', value: hasDangerous ? 'Yes' : 'No', inline: true }
                );
                
                if (roles.length > 0) {
                    embed.addFields({ 
                        name: `Roles (${member.roles.cache.size - 1})`, 
                        value: roles.length === 10 ? roles.join(', ') + '...' : roles.join(', '), 
                        inline: false 
                    });
                }
            }
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('clearchat')
            .setDescription('Clear your AI conversation history'),
        async execute(interaction) {
            const aiChatbot = require('../utils/aiChatbot');
            aiChatbot.clearHistory(interaction.user.id);
            await interaction.reply('Your AI conversation history has been cleared! Our next chat will start fresh.');
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
                    { name: 'Fun Commands', value: '`/help` - to get all existing commands info\n`/hug` - Give someone a hug\n`/kick` - Playfully kick someone\n`/punch` - Playfully punch someone\n`/kill` - Playfully eliminate someone\n`/happy` - Show that you are happy\n`/kiss` - Give someone a kiss\n`/cry` - Show that you are crying\n`/laugh` - Show that you are laughing\n`/dance` - Show your dance moves\n`/twerk` - Show your twerking skills', inline: false },
                    { name: 'Utility Commands', value: '`/serverinfo` - Get server information\n`/membercount` - Get member count\n`/userinfo` - Get user information\n`/afk` - Mark yourself as AFK\n', inline: false },
                    { name: 'AI Chatbot', value: 'Mention me or reply to my messages for intelligent AI conversations powered by ChatGPT!', inline: false },
                    { name: 'Invite Bot', value: `[Click here to invite me to your server!](https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=268435456&scope=bot%20applications.commands)`, inline: false }
                )
                .setColor(0x0099FF)
                .setFooter({ text: 'You can also use prefix commands with shortcuts: !si, !mc, !ui' })
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        }
    }
];

module.exports = { commands, slashCommands };