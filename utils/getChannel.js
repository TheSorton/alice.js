const getConfig = (guild, type) => {
    switch(type) {
        case 'log':
            let gID = configModel.findOne({ guildID: guild });
            if (gID) { 
                let msgDoc = await configModel.findOne({ guildID: guild }); 
                let { config } = msgDoc;
                let logChan = config.logChan;
            return logChan;
    }
        case 'wel':
            let gID = configModel.findOne({ guildID: guild });
            if (gID) { 
                let msgDoc = await configModel.findOne({ guildID: guild }); 
                let { config } = msgDoc;
                let welChan = config.welChan;
                return welChan;
            }
        case 'mute':
            let gID = configModel.findOne({ guildID: guild });
            if (gID) { 
                let msgDoc = await configModel.findOne({ guildID: guild }); 
                let { config } = msgDoc;
                let muteRole = config.muteRole;
                return muteRole;
            }
    }
}


exports.getChannel = { getChannel };