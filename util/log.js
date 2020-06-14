
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
		deleteEmbed.setAuthor(`A message by ${message.author.tag} was deleted by ${executor.tag}`, message.author.avatarURL({type: 'png'}))		
	}	
	else {
		deleteEmbed.setAuthor(`${message.author.tag} deleted their message`, message.author.avatarURL({type: 'png'}));
	}
	if (message.attachments.size > 0) {
		deleteEmbed.addField('Attachment', message.attachments.first().proxyURL)
	}
	client.channels.cache.get(config['Channels']['Log']).send({embed: deleteEmbed});
});

// Edited message log
client.on('messageUpdate', (oldMessage, newMessage) => {
	// Was it a bot?
	if (oldMessage.author.bot) return;
	else {
		// If it wasn't a bot, we should log this
		// Let's create an embed for this
		const editEmbed = new Discord.MessageEmbed()
		.setColor('#363636')
		.setAuthor(`${oldMessage.author.tag} edited their message`, oldMessage.author.avatarURL({type: 'png'}))
		.addFields(
			{name: 'Original Message', value: oldMessage.content || "Message not found"},
			{name: 'Edited Message', value: newMessage.content || "Message not found"}
		)
		.setFooter(`Message ID: ${newMessage.id} | Author ID: ${newMessage.author.id}`)

		// Embed done, so let's send it to our logging channel
        client.channels.cache.get(config['Channels']['Log']).send({embed: editEmbed })
	}
});

// Nickname update log
client.on('guildMemberUpdate', async (oldMember, newMember) => {
	const fetchedLogs = await oldMember.guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_UPDATE',
	});
	const memberUpdateLog = fetchedLogs.entries.first();
	const { executor, target } = memberUpdateLog;

	// Whenever someone joins, guildMemberUpdate emits
	// Since we are checking if and only if someone updates their nickname, alice should only log if the nicknames don't match.
	if (oldMember.nickname !== newMember.nickname) {
	const updateEmbed = new Discord.MessageEmbed()
	.setColor('#363636')
	.addFields(
		{name: 'Old Nickname', value: oldMember.nickname || "No user-defined nickname", inline: true},
		{name: 'New Nickname', value: newMember.nickname || "No user-defined nickname", inline: true}
	)
	.setFooter(`User ID: ${newMember.id}`)
	if (target.id === executor.id) {
		updateEmbed.setAuthor(`${target.username} changed their username`, target.avatarURL({type: 'png'}))
	}
	else {
		updateEmbed.setAuthor(`${target.username} had their nickname changed by ${executor.username}`,target.avatarURL({type: 'png'}))
	}
	client.channels.cache.get(config['Channels']['Log']).send({embed: updateEmbed})
}
})

// Ban log
client.on('guildBanAdd', async (guild, member) => {
	const fetchedLogs = await guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_BAN_ADD',
	});
	const banAddLog = fetchedLogs.entries.first();
	const { executor, target, reason } = banAddLog;

	// If the executor was the bot, return since the ban command has its own log
	if (executor === client.user.id) return;
	else {
		let embed = new Discord.MessageEmbed()
        .setColor('#a30000')
        .setAuthor(`${target.tag} was banned by ${executor.tag}`, target.avatarURL({type: 'png'}))
        .addField('Banned Time', "Not available because alice was not used.")
        .addField('Banned Reason', 	)
        .setFooter('Banned user ID: ' + target.id);
        client.channels.cache.get(config['Channels']['Log']).send({embed: embed})
	}
})

// Tell in system channel when member left
client.on('guildMemberRemove', async guildMember => {
	guildMember.guild.systemChannel.send(`**${guildMember.user.tag}** has left.`)})

// Same but when they join
client.on('guildMemberAdd', async guildMember => {
	guildMember.guild.systemChannel.send(`<@${guildMember.user.id}> has joined.`)}) 