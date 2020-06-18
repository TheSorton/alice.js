// Add and remove self-assignable role based on a reaction to a message that was set using initrolemsg

const addUserRole = (reaction, user, emojiRoleMap) => {
    if (emojiRoleMap.hasOwnProperty(reaction.emoji.name)); {
        let roleID = emojiRoleMap[reaction.emoji.name];
        let role = reaction.message.guild.roles.cache.get(roleID);
        let member = reaction.message.guild.members.cache.get(user.id);

        if (role && member) {
            member.roles.add(roleID);
        }
    }
    return;
}

const delUserRole = (reaction, user, emojiRoleMap) => {
    if (emojiRoleMap.hasOwnProperty(reaction.emoji.name)); {
        let roleID = emojiRoleMap[reaction.emoji.name];
        let role = reaction.message.guild.roles.cache.get(roleID);
        let member = reaction.message.guild.members.cache.get(user.id);

        if (role && member) {
            member.roles.remove(roleID);
        }
    }
    return;
}


exports.userRoles = { addUserRole, delUserRole }