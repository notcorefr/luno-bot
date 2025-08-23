const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Collections for commands
client.commands = new Collection();
client.slashCommands = new Collection();
client.cooldowns = new Collection();

// Load command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join('./commands', file);
    const command = require(filePath);
    
    if (command.commands) {
        command.commands.forEach(cmd => {
            client.commands.set(cmd.name, cmd);
            
            // Add aliases to the collection
            if (cmd.aliases) {
                cmd.aliases.forEach(alias => {
                    client.commands.set(alias, cmd);
                });
            }
        });
    }
    
    if (command.slashCommands) {
        command.slashCommands.forEach(cmd => {
            client.slashCommands.set(cmd.data.name, cmd);
        });
    }
}

// Load event files
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join('./events', file);
    const event = require(filePath);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Register slash commands
async function registerSlashCommands() {
    const commands = [];
    
    // Collect all slash commands
    client.slashCommands.forEach(command => {
        commands.push(command.data.toJSON());
    });

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await registerSlashCommands();
});

// Error handling
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
    process.exit(1);
});

client.login(process.env.TOKEN);