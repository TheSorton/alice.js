import { queryMongoCollection, addToMongoCollection } from "../lib/mongo/mongo";
import { mClient } from "../alice";

import { Events } from "discord.js";

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        // See if user is in the alice.users collection. if not, add them
        // to the collection.

        if (
          await queryMongoCollection(
            "alice",
            "users",
            { username: interaction.user.username },
            mClient
          )
        ) {
          await command.execute(interaction);
        } else {
          await addToMongoCollection(mClient, {
            lastUpdated: new Date(),
            username: interaction.user.username,
            userID: parseInt(interaction.user.id),
            created: interaction.user.createdAt,
          });
          await command.execute(interaction);
        }
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
      }
    } else if (interaction.isButton()) {
      // respond to the button
    } else if (interaction.isStringSelectMenu()) {
      // respond to the select menu
    }
  },
};
