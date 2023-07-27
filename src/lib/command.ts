import * as Discord from "discord.js";
import aliceClient from "./aliceClient";

export default class Command {
  name: string;
  description: string;
  category?: string;
  aliases?: string[];
  usage?: string;
  guildOnly?: boolean;
  ownerOnly?: boolean;
  adminRequired?: boolean;
  argsRequired?: boolean;
  cooldown?: number;
  run: (
    message: Discord.Message,
    args?: string[],
    client?: aliceClient
  ) => void;

  constructor(props: {
    name: string;
    description: string;
    aliases: string[];
    usage: string;
    guildOnly: boolean;
    ownerOnly: boolean;
    adminReq: boolean;
    argsRequired: boolean;
    cooldown: number;
    run: (message: Discord.Message, args?: string[]) => void;
  }) {
    this.name = props.name;
    this.description = props.description;
    this.aliases = props.aliases;
    this.usage = props.usage;
    this.guildOnly = props.guildOnly;
    this.ownerOnly = props.ownerOnly;
    this.adminRequired = props.adminReq;
    this.argsRequired = props.argsRequired;
    this.cooldown = props.cooldown;
    this.run = props.run;
  }
}
