let guild = configModel.findOne({ guildID: member.guild.id });
let { config } = guild
let logChan = config.logChan

// Guild Member joins
client.on('guildMemberAdd', member => {
    member.guild.systemChannel.send(`<@${member.id}> has joined.`)

})

// Guild Member leaves
client.on('guildMemberRemove', member => {
    member.guild.systemChannel.send(`**${member.user.tag}** has left.`)
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
        oldMember.guild.channels.cache.find(x => x.id === logChan).send({embed: updateEmbed})
    }
    else {
        return
    }
})