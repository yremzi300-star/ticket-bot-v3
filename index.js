const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

client.commands = new Collection();

// Komutları yükle
const commandsPath = path.join(__dirname, 'src/commands');
for (const file of fs.readdirSync(commandsPath)) {
  const command = require(`./src/commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Eventleri yükle
const eventsPath = path.join(__dirname, 'src/events');
for (const file of fs.readdirSync(eventsPath)) {
  const event = require(`./src/events/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
}

client.login(config.token);
