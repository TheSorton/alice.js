
// Deleted message log
client.on('messageDelete', async message => {
	// ignore direct messages
	if (!message.guild) return;
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const deletionLog = fetchedLogs.entries.first();

	// Did we get something?
	if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

	// Who deleted the message
	const { executor, target } = deletionLog;

	const deleteEmbed = new Discord.MessageEmbed()
	.setColor('#363636')
	.addFields(
		{name: 'Message', value: message.cleanContent, inline: true},
		{name: "Channel", value: message.channel, inline: true}

	)
	.setFooter(`Message ID: ${message.id} | Author ID: ${message.author.id}`)

	// Enhance the embed based on specific conditions
	if (target.id === message.author.id) {
		deleteEmbed.setAuthor(`A message by ${message.author.tag} was deleted by ${executor.tag}.`, message.author.avatarURL('png'))		
	}	
	else {
		deleteEmbed.setAuthor(`${message.author.tag} deleted their message.`, message.author.avatarURL('png'));
	}
	if (message.attachments.size > 0) {
		deleteEmbed.addField('Attachment', message.attachments.first().proxyURL)
	}
	client.channels.cache.get(config['Channels']['Log']).send({embed: deleteEmbed});
});

client.on('messageUpdate', (oldMessage, newMessage) => {
	if (oldMessage.author === oldMessage.author.bot) return;
	else {
        console.log(oldMessage.content + '\n' + newMessage.content)
		const editEmbed = new Discord.MessageEmbed()
		.setColor('#363636')
		.addFields(
			{name: 'Original Message', value: oldMessage.content || "Message not found"},
			{name: 'Edited Message', value: newMessage.content || "Message not found"}
		)
		.setFooter(`Message ID: ${newMessage.id} | Author ID: ${newMessage.author.id}`)
        client.channels.cache.get(config['Channels']['Log']).send({embed: editEmbed })
	  }
  });