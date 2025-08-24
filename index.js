const { Client, GatewayIntentBits, Collection, REST, Routes, ActivityType, PresenceUpdateStatus } = require('discord.js');
const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const path = require('path');
require('dotenv').config();


// KEEP ALIVE SERVER
app.get('/', (req, res) => {
  res.send({isWorking: true})
})

app.listen(port, () => {
  console.log(`Server Startedd on port ${port}`)
})


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
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('Loading commands from:', commandsPath);
console.log('Command files found:', commandFiles);

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    console.log('Loading command file:', filePath);
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
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

console.log('Loading events from:', eventsPath);
console.log('Event files found:', eventFiles);

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    console.log('Loading event file:', filePath);
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

client.once('ready', async (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Philiix Gooning', { type: ActivityType.Watching});
    client.user.setStatus(PresenceUpdateStatus.DoNotDisturb);;
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