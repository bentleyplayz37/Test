const express = require('express');
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, Events, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

// Web server for 24/7 hosting (e.g., Glitch)
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('McDonald’s Bot is alive!');
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// Founder / Collaborators list
const collaborators = [
  '1201288634779844759', // Founder
];

const commands = [
  {
    data: new SlashCommandBuilder().setName('big-mac').setDescription('Order a Big Mac!'),
    async execute(interaction) {
      await interaction.reply('🍔 Here’s your Big Mac!');
    },
  },
  {
    data: new SlashCommandBuilder().setName('fries').setDescription('Get some fries!'),
    async execute(interaction) {
      await interaction.reply('🍟 Coming right up!');
    },
  },
  {
    data: new SlashCommandBuilder().setName('pay').setDescription('Pay for your order'),
    async execute(interaction) {
      await interaction.reply('💳 Payment received. Thanks!');
    },
  },
  {
    data: new SlashCommandBuilder().setName('mrvmax').setDescription('Order the Mr V Max deal'),
    async execute(interaction) {
      await interaction.reply('🔥 Mr V Max deal activated!');
    },
  },
  {
    data: new SlashCommandBuilder()
      .setName('announcement')
      .setDescription('Make an announcement (Admins only)')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
      await interaction.reply('📢 Announcement sent!');
    },
  },
  {
    data: new SlashCommandBuilder()
      .setName('collaborates')
      .setDescription('Collaborators only command'),
    async execute(interaction) {
      if (!collaborators.includes(interaction.user.id)) {
        return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
      }
      await interaction.reply('🤝 Collaborators unite! Founder access confirmed.');
    },
  },
  {
    data: new SlashCommandBuilder().setName('info').setDescription('Get info about the bot'),
    async execute(interaction) {
      await interaction.reply('ℹ️ McDonald’s Bot v2.0 — Serving delicious orders since forever!');
    },
  },
  {
    data: new SlashCommandBuilder().setName('menu').setDescription('Show the menu'),
    async execute(interaction) {
      await interaction.reply('📜 Menu:\n- Big Mac\n- Fries\n- Mr V Max\n- Deals');
    },
  },
  {
    data: new SlashCommandBuilder().setName('status').setDescription('Check the bot status'),
    async execute(interaction) {
      await interaction.reply('🍦 The ice cream machine is currently **down**. Sorry for the inconvenience!');
    },
  },
  {
    data: new SlashCommandBuilder().setName('deals').setDescription('See current deals'),
    async execute(interaction) {
      await interaction.reply('💥 Current deals:\n- 2 Big Macs for $5\n- Large fries free with any Mr V Max order');
    },
  },
];

// Register slash commands
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands.map(cmd => cmd.data.toJSON()) },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  console.log(`**All commands have been rewritten as proper slash commands!**`);
  console.log(`The new available commands are:`);
  console.log(`/big-mac, /fries, /pay, /mrvmax, /announcement (admin only), /collaborates (collab only), /info, /menu, /status, /deals`);
  console.log(`⚠️ We also want to publicly apologize for the issue caused by the old mc!check command replying to everyone with “all done.” That bug has been removed and replaced with proper slash commands to prevent this from happening again.`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.find(cmd => cmd.data.name === interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(process.env.TOKEN);
