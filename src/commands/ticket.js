const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const stats = require('../utils/stats');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket sistemi')
    .addSubcommand(s => s.setName('panel').setDescription('Ticket paneli gönderir'))
    .addSubcommand(s => s.setName('stats').setDescription('Ticket istatistikleri'))
    .addSubcommand(s => s.setName('stats-reset').setDescription('Tüm ticket istatistiklerini sıfırlar (ADMIN)')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'panel') {
      const embed = new EmbedBuilder()
        .setTitle('🎫 Ticket Sistemi')
        .setDescription('Aşağıdan işlem seç')
        .setColor(config.embedColor);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket_open').setLabel('Ticket Aç').setStyle(ButtonStyle.Primary)
      );

      return interaction.reply({ embeds: [embed], components: [row] });
    }

    if (sub === 'stats') {
      const data = stats.get();
      const list = Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .map((x, i) => `#${i + 1} <@${x[0]}> – ${x[1]}`)
        .join('\n') || 'Veri yok';

      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle('📊 Ticket Stats')
          .setDescription(list)
          .setColor(config.embedColor)]
      });
    }

    if (sub === 'stats-reset') {
      if (!interaction.member.roles.cache.has(config.adminRole))
        return interaction.reply({ content: 'Yetkin yok', ephemeral: true });

      stats.reset();
      return interaction.reply({ content: '✅ Tüm ticket istatistikleri sıfırlandı', ephemeral: true });
    }
  }
};
