require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');

const clientId = '1377383232575897760';
const guildId = '1376291611318812773';
const token = process.env.DISCORD_TOKEN; 

const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('⏳ Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );
        console.log('✅ Slash commands registered.');
    } catch (error) {
        console.error(error);
    }
})();
