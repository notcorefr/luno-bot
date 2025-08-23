const commandHandler = require('../utils/commandHandler');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        await commandHandler.handleSlashCommand(interaction, client);
    }
};