const _embed_data_ = { channels: {} }; // basic template, filled with no data

/// interface EmbedData { embed_id: Snowflake, timestamp: Time }
/// whatever time is here

/// storeEmbed :: Message -> EmbedData
///
/// Stores data associated with a '%image' embed, so that reaction stuffs
/// can be checked later.
///
/// @param msg The embed posted by '%image'.
/// @returns The embed data stored
const storeEmbed = msg => {
    const result = {
        embed_id: msg.id,
        timestamp: msg.createdTimestamp // dunno how you wanna get the timestamp, but that goes here
    };
    _embed_data_.channels[msg.channel.id] = result;
    return result;
};

/// getEmbed :: Message -> Maybe<EmbedData>
///
/// Retrieves the embed data associated with a given message.
///
/// @param msg Message to retrieve the embed data of (generally should be
///            a '%image' embed, but could be any message).
/// @returns The embed data associated with the message, or null if no such
///          data exists.
const getEmbed = msg => {
    if (msg.channel.id in _embed_data_.channels) {
        return _embed_data_.channels[msg.channel.id];
    }
    return null;
};


/// isReactionOnImageCmdEmbed :: Message -> Bool
///
/// Determines if a reaction has been applied to a '%image' embed, as well
/// as validating various criteria (for example, user should not be able
/// to scroll images forever).
///
/// @param msg Message reaction was applied to.
/// @returns Boolean as per above.
const isReactionOnImageCmdEmbed = msg => {
    const reactThreshold = 1000*60*1;  // 1 minute to use scrolling

    const embed = getEmbed(msg); // can be null
    if (!embed) return false;
    
    const current_time = new Date().getTime(); // again, get timestamp yourself :^)
    return (Math.abs(current_time - embed.timestamp) < reactThreshold
            && msg.id === embed.embed_id);
};

exports.embedData = { storeEmbed, isReactionOnImageCmdEmbed }

///
/// then, for the 'messageReactionRemove' event, you can do if (isReactionOnImageCmdEmbed(reaction.message)) { ... instead of the reaction.message.id === embedID
///    and in the embed send, instead of doing embedID = msg.id, instead doing storeEmbed(msg)
///    again, youll have to replace the Math.abs(...) < threshold stuff with the actual code for your Time datatype
