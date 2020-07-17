const ytdl = require('ytdl-core');

const serverQueueInit = async (message, queue, args) => {

    const play = (guild, song) => {
        var serverQueue = queue.get(guild.id)
        if (!song) {
            serverQueue.voiceChan.leave();
            queue.delete(guild.id)
            return
        }

        const dispatcher = serverQueue.connection.play(ytdl(song.link))
        .on('finish', () => {
            serverQueue.songs.shift()
            play(guild, serverQueue.songs[0])
        })
        .on('error', error => {
            console.log(error)
        })

    }


    serverQueue = queue.get(message.guild.id)

    var voiceChannel = message.member.voice.channel

    const songInfo = await ytdl.getInfo(args[0])

    const song = {
        title: songInfo.videoDetails.title,
        link: songInfo.videoDetails.video_url
    }

    if (!serverQueue) {
        const queueConstruct = {
            textChan: message.channel,
            voiceChan: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        }
        queue.set(message.guild.id, queueConstruct)

        queueConstruct.songs.push(song)
        try {
            var connection = await voiceChannel.join()
            queueConstruct.connection = connection
            play(message.guild, queueConstruct.songs[0])
            message.reply(`***${song.title}*** will now play.`)

        }
        catch (err) {
            return console.log(err)
        }
    }
    else {
        serverQueue.songs.push(song)
        console.log(serverQueue)
        message.reply(`***${song.title}*** has been added to the queue.`)
        return serverQueue;

    }
}

exports.queue = { serverQueueInit };