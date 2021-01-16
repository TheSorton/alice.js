import {Message} from 'discord.js';
import { prefix } from '../../lib/aliceClient';
import { cleanEveryone, cleanHere } from "../../lib/sanitize";
module.exports = {
  name: 'say',
  description: 'A basic say command.',
  usage: `say something`,
  argsRequired: true,
  run(message: Message, args: string[]) {
    let out = args.map(arg => cleanEveryone(cleanHere(arg)));
    message.channel.send(out)
  },
};
