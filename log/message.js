// Deleted message log
client.on('messageDelete', async message => {
	// ignore partials
	if (message.partial) return
	if (oldMessage.author.bot) return
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

	const deleteEmbed = new discord.MessageEmbed()
	.setColor('#363636')
	.addFields(
		{name: 'Message', value: message.cleanContent, inline: true},
		{name: "Channel", value: message.channel, inline: true}

	)
	.setFooter(`Message ID: ${message.id} | Author ID: ${message.author.id}`)

	// Enhance the embed based on specific conditions
	if (target.id === message.author.id) {
		deleteEmbed.setAuthor(`A message by ${message.author.tag} was deleted by ${executor.tag}`, message.author.avatarURL({type: 'png'}))		
	}	
	else {
		deleteEmbed.setAuthor(`${message.author.tag} deleted their message`, message.author.avatarURL({type: 'png'}));
	}
	if (message.attachments.size > 0) {
		deleteEmbed.addField('Attachment', message.attachments.first().proxyURL)
	}
	client.channels.cache.get(config.bot.log).send({embed: deleteEmbed});
});

// Edited message log
client.on('messageUpdate', (oldMessage, newMessage) => {
	// ignore partials
	if (oldMessage.partial) return
	if (oldMessage.author.bot) return
	else {
		// If it wasn't a bot, we should log this
		// Let's create an embed for this
		const editEmbed = new discord.MessageEmbed()
		.setColor('#363636')
		.setAuthor(`${oldMessage.author.tag} edited their message`, oldMessage.author.avatarURL({type: 'png'}))
		.addFields(
			{name: 'Original Message', value: oldMessage.content || "Message not found"},
			{name: 'Edited Message', value: newMessage.content || "Message not found"}
		)
		.setFooter(`Message ID: ${newMessage.id} | Author ID: ${newMessage.author.id}`)

		// Embed done, so let's send it to our logging channel
        client.channels.cache.get(config.bot.log).send({embed: editEmbed })
	}
});