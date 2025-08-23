const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Helper function to fetch anime GIF
async function getAnimeGif(action) {
    try {
        const response = await fetch(`https://nekos.best/api/v2/${action}`);
        const data = await response.json();
        return data.results[0].url;
    } catch (error) {
        console.error(`Error fetching ${action} GIF:`, error);
        return null;
    }
}

const commands = [
    {
        name: 'hug',
        description: 'Give someone a hug',
        async execute(message, args) {
            const target = message.mentions.users.first() || message.author;
            const targetName = target.id === message.author.id ? 'themselves' : target.username;
            
            const gifUrl = await getAnimeGif('hug');
            const embed = new EmbedBuilder()
                .setDescription(`${message.author.username} gives ${targetName} a warm hug!`)
                .setColor(0xFF69B4);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            message.reply({ embeds: [embed] });
        }
    },
    {
        name: 'kick',
        description: 'Playfully kick someone',
        async execute(message, args) {
            const target = message.mentions.users.first() || message.author;
            const targetName = target.id === message.author.id ? 'themselves' : target.username;
            
            const gifUrl = await getAnimeGif('slap');
            const embed = new EmbedBuilder()
                .setDescription(`${message.author.username} playfully kicks ${targetName}!`)
                .setColor(0xFF4500);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            message.reply({ embeds: [embed] });
        }
    },
    {
        name: 'punch',
        description: 'Playfully punch someone',
        async execute(message, args) {
            const target = message.mentions.users.first() || message.author;
            const targetName = target.id === message.author.id ? 'themselves' : target.username;
            
            const gifUrl = await getAnimeGif('punch');
            const embed = new EmbedBuilder()
                .setDescription(`${message.author.username} playfully punches ${targetName}!`)
                .setColor(0xDC143C);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            message.reply({ embeds: [embed] });
        }
    },
    {
        name: 'kill',
        description: 'Playfully eliminate someone',
        async execute(message, args) {
            const target = message.mentions.users.first() || message.author;
            const targetName = target.id === message.author.id ? 'themselves' : target.username;
            
            const gifUrl = await getAnimeGif('bite');
            const embed = new EmbedBuilder()
                .setDescription(`${message.author.username} playfully eliminates ${targetName} from the game!`)
                .setColor(0x8B0000);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            message.reply({ embeds: [embed] });
        }
    },
    {
        name: 'happy',
        description: 'Show that you are happy',
        async execute(message, args) {
            const gifUrl = await getAnimeGif('happy');
            const embed = new EmbedBuilder()
                .setDescription(`${message.author.username} is feeling very happy today!`)
                .setColor(0xFFD700);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            message.reply({ embeds: [embed] });
        }
    },
    {
        name: 'kiss',
        description: 'Give someone a kiss',
        async execute(message, args) {
            const target = message.mentions.users.first() || message.author;
            const targetName = target.id === message.author.id ? 'themselves' : target.username;
            
            const gifUrl = await getAnimeGif('kiss');
            const embed = new EmbedBuilder()
                .setDescription(`${message.author.username} gives ${targetName} a sweet kiss!`)
                .setColor(0xFF1493);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            message.reply({ embeds: [embed] });
        }
    },
    {
        name: 'cry',
        description: 'Show that you are crying',
        async execute(message, args) {
            const gifUrl = await getAnimeGif('cry');
            const embed = new EmbedBuilder()
                .setDescription(`${message.author.username} is crying!`)
                .setColor(0x4682B4);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            message.reply({ embeds: [embed] });
        }
    },
    {
        name: 'laugh',
        description: 'Show that you are laughing',
        async execute(message, args) {
            const gifUrl = await getAnimeGif('laugh');
            const embed = new EmbedBuilder()
                .setDescription(`${message.author.username} is laughing out loud!`)
                .setColor(0xFFD700);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            message.reply({ embeds: [embed] });
        }
    },
    {
        name: 'dance',
        description: 'Show your dance moves',
        async execute(message, args) {
            const gifUrl = await getAnimeGif('dance');
            const embed = new EmbedBuilder()
                .setDescription(`${message.author.username} is showing off their amazing dance moves!`)
                .setColor(0xFF69B4);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            message.reply({ embeds: [embed] });
        }
    },
    {
        name: 'twerk',
        description: 'Show your twerking skills',
        async execute(message, args) {
            // Using dance as fallback since twerk might not be available
            const gifUrl = await getAnimeGif('dance');
            const embed = new EmbedBuilder()
                .setDescription(`${message.author.username} is twerking like there's no tomorrow!`)
                .setColor(0xFF1493);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            message.reply({ embeds: [embed] });
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
            
            const gifUrl = await getAnimeGif('hug');
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user.username} gives ${targetName} a warm hug!`)
                .setColor(0xFF69B4);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            await interaction.reply({ embeds: [embed] });
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
            
            const gifUrl = await getAnimeGif('slap');
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user.username} playfully kicks ${targetName}!`)
                .setColor(0xFF4500);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            await interaction.reply({ embeds: [embed] });
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
            
            const gifUrl = await getAnimeGif('punch');
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user.username} playfully punches ${targetName}!`)
                .setColor(0xDC143C);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            await interaction.reply({ embeds: [embed] });
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
            
            const gifUrl = await getAnimeGif('bite');
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user.username} playfully eliminates ${targetName} from the game!`)
                .setColor(0x8B0000);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('happy')
            .setDescription('Show that you are happy'),
        async execute(interaction) {
            const gifUrl = await getAnimeGif('happy');
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user.username} is feeling very happy today!`)
                .setColor(0xFFD700);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('kiss')
            .setDescription('Give someone a kiss')
            .addUserOption(option =>
                option.setName('target')
                    .setDescription('The user to kiss')
                    .setRequired(false)),
        async execute(interaction) {
            const target = interaction.options.getUser('target') || interaction.user;
            const targetName = target.id === interaction.user.id ? 'themselves' : target.username;
            
            const gifUrl = await getAnimeGif('kiss');
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user.username} gives ${targetName} a sweet kiss!`)
                .setColor(0xFF1493);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('cry')
            .setDescription('Show that you are crying'),
        async execute(interaction) {
            const gifUrl = await getAnimeGif('cry');
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user.username} is crying!`)
                .setColor(0x4682B4);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('laugh')
            .setDescription('Show that you are laughing'),
        async execute(interaction) {
            const gifUrl = await getAnimeGif('laugh');
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user.username} is laughing out loud!`)
                .setColor(0xFFD700);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('dance')
            .setDescription('Show your dance moves'),
        async execute(interaction) {
            const gifUrl = await getAnimeGif('dance');
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user.username} is showing off their amazing dance moves!`)
                .setColor(0xFF69B4);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('twerk')
            .setDescription('Show your twerking skills'),
        async execute(interaction) {
            // Using dance as fallback since twerk might not be available
            const gifUrl = await getAnimeGif('dance');
            const embed = new EmbedBuilder()
                .setDescription(`${interaction.user.username} is twerking like there's no tomorrow!`)
                .setColor(0xFF1493);
            
            if (gifUrl) {
                embed.setImage(gifUrl);
            }
            
            await interaction.reply({ embeds: [embed] });
        }
    }
];

module.exports = { commands, slashCommands };