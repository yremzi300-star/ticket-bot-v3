module.exports = {
  name: 'ready',
  execute(client) {
    console.log(`[TICKET] ${client.user.tag} aktif`);
  }
};
