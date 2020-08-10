/* 
 * MIT License
 *
 * Copyright (c) 2019 Saanu Reghunadh
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const { MessageEmbed } = require('discord.js');

const defEmojiList = [
  '\u0031\u20E3',
  '\u0032\u20E3',
  '\u0033\u20E3',
  '\u0034\u20E3',
  '\u0035\u20E3',
  '\u0036\u20E3',
  '\u0037\u20E3',
  '\u0038\u20E3',
  '\u0039\u20E3',
  '\uD83D\uDD1F'
];

const pollEmbed = async (msg, title, options, timeout = 120, emojiList = defEmojiList.slice(), forceEndPollEmoji = '\u2705') => {
  if (!msg && !msg.channel) return msg.reply('Channel is inaccessible.');
  if (!title) return msg.reply('Poll title is not given.');
  if (!options) return msg.reply('Poll options are not given.');
  if (options.length < 2) return msg.reply('Please provide more than one choice.');
  if (options.length > emojiList.length) return msg.reply(`Please provide ${emojiList.length} or less choices.`);

  let text = `*To vote, react using the correspoding emoji.\nThe poll will close in **${timeout} seconds**.\n<@${msg.author.id}> can end the poll by reacting to the ${forceEndPollEmoji} emoji.*\n\n`;
  const emojiInfo = {};
  for (const option of options) {
    const emoji = emojiList.splice(0, 1);
    emojiInfo[emoji] = { option: option, votes: 0 };
    text += `${emoji} : \`${option}\`\n\n`;
  }
  const usedEmojis = Object.keys(emojiInfo);
  usedEmojis.push(forceEndPollEmoji);

  const poll = await msg.channel.send(embedBuilder(title, msg.author.tag, msg).setDescription(text));
  for (const emoji of usedEmojis) await poll.react(emoji);

  const reactionCollector = poll.createReactionCollector(
    (reaction, user) => usedEmojis.includes(reaction.emoji.name) && !user.bot,
    timeout === 0 ? {} : { time: timeout * 1000, dispose: true }
  );
  const voterInfo = new Map();
  reactionCollector.on('collect', (reaction, user) => {
    if (usedEmojis.includes(reaction.emoji.name)) {
      if (reaction.emoji.name === forceEndPollEmoji && msg.author.id === user.id) return reactionCollector.stop();
      if (!voterInfo.has(user.id)) voterInfo.set(user.id, { emoji: reaction.emoji.name });
      var votedEmoji = voterInfo.get(user.id).emoji;
      if (votedEmoji !== reaction.emoji.name) {
        const lastVote = poll.reactions.cache.get(votedEmoji);
        lastVote.users.remove(user.id);
        voterInfo.set(user.id, { emoji: reaction.emoji.name });
      }
      emojiInfo[reaction.emoji.name].votes += 1;
    }
  });

  reactionCollector.on('remove', (reaction, user) => {
    if (usedEmojis.includes(reaction.emoji.name)) {
      emojiInfo[reaction.emoji.name].votes -= 1;
    }
  });

  reactionCollector.on('end', () => {
    text = '*Time\'s up!\n Here are the results.*\n\n';
    for (const emoji in emojiInfo) text += `\`${emojiInfo[emoji].option}\` - \`${emojiInfo[emoji].votes} vote(s)\`\n\n`;
    poll.delete();
    msg.channel.send(embedBuilder(title, msg.author.tag, msg).setDescription(text));
  });
};

const embedBuilder = (title, author, message) => {
  return new MessageEmbed()
    .setTitle(`${title}`)
    .setAuthor(`${author} started a poll!`, message.author.avatarURL('png'));
};

module.exports = pollEmbed;
