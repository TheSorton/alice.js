

// Guild Member joins
client.on('guildMemberAdd', async member => {
    let guild = configModel.findOne({ guildID: member.guild.id });
    if (guild) { 
        let msgDoc = await configModel.findOne({ guildID: member.guild.id }); 
        if (msgDoc) {
        let { config } = msgDoc;
        let welChan = config.welChan 
        member.guild.channels.cache.find(x => x.id === welChan).send(`<@${member.id}> has joined.`)}
        else return
    }

})

// Guild Member leaves
client.on('guildMemberRemove', async member => {
    let guild = configModel.findOne({ guildID: member.guild.id });
    if (guild) { 
        let msgDoc = await configModel.findOne({ guildID: member.guild.id }); 
        if (msgDoc) {
        let { config } = msgDoc;
        let welChan = config.welChan 
        member.guild.channels.cache.find(x => x.id === welChan).send(`**${member.user.tag}** has left.`)}
        else return
    }
})

// Guild member changes something
client.on('guildMemberUpdate', async (oldMember, newMember) => {
	const fetchedLogs = await oldMember.guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_UPDATE',
    });
        const memberUpdateLog = fetchedLogs.entries.first();
        const { executor, target } = memberUpdateLog;

        var updateEmbed = new discord.MessageEmbed()
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
    if (oldMember.nickname !== newMember.nickname) {
        let guild = configModel.findOne({ guildID: newMember.guild.id });
        if (guild) { 
            let msgDoc = await configModel.findOne({ guildID: newMember.guild.id });
            if (msgDoc) { 
            let { config } = msgDoc;
            let logChan = config.logChan
            newMember.guild.channels.cache.find(x => x.id === logChan).send({embed: updateEmbed})}
            else return 
        }
    }
    else {
        return
    }
})
