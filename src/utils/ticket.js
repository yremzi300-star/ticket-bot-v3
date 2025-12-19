const { EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');
const stats = require('./stats');

const claimed = new Map();

module.exports = {
  async createTicket(interaction) {
    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      parent: config.ticketCategory,
      permissionOverwrites: [
        { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel] },
        { id: config.staffRole, allow: [PermissionFlagsBits.ViewChannel] }
      ]
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_claim').setLabel('Claim').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('ticket_close').setLabel('Ticket Kapat').setStyle(ButtonStyle.Danger)
    );

    const embed = new EmbedBuilder()
      .setTitle('🎫 Ticket Açıldı')
      .setDescription('Yetkili claim alacaktır.')
      .setColor(config.embedColor);

    await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: 'Ticket oluşturuldu', ephemeral: true });
  },

  async claimTicket(interaction) {
    if (!interaction.member.roles.cache.has(config.staffRole))
      return interaction.reply({ content: 'Yetkin yok', ephemeral: true });

    if (claimed.has(interaction.channel.id))
      return interaction.reply({ content: 'Bu ticket zaten claimlendi.', ephemeral: true });

    claimed.set(interaction.channel.id, interaction.user.id);
    await interaction.channel.setName(`claimed-${interaction.user.username}`);

    await interaction.reply(`🎯 Ticket ${interaction.user} tarafından claimlendi.`);
  },

  async closeTicket(interaction) {
    const claimer = claimed.get(interaction.channel.id);
    if (claimer) stats.add(claimer);

    const log = interaction.guild.channels.cache.get(config.logChannel);
    if (log) {
      log.send(`🎫 Ticket kapatıldı | Kanal: ${interaction.channel.name} | Claim: <@${claimer || 'yok'}>`);
    }

    await interaction.channel.delete();
  }
};
