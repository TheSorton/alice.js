import { SlashCommandBuilder } from "discord.js";

// Rock paper scisssors slash command

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rps")
        .setDescription("Play a game of rock paper scissors")
        .addStringOption((option) =>
            option
                .setName("choice")
                .setDescription("Choose rock, paper, or scissors")
                .setRequired(true)
                .addChoices(
                    {name: "Rock", value: "rock"},
                    {name: "Paper", value: "paper"},
                    {name: "Scissors", value: "scissors"}
                )),
    async execute(interaction) {
        const choices = ["rock", "paper", "scissors"];
        const choice = interaction.options.getString("choice");
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        const getEmoji = (choice: string) => {
            switch(choice) {
                case "rock":
                    return "🗿";
                case "paper":
                    return "📜";
                case "scissors":
                    return "✂️";
            }
        };

        const result = (player: string, bot:string) => {
            if (player === bot) return "It's a tie!";
            switch(player) {
                case "rock":
                    return bot === "paper" ? `You lose! I chose ${getEmoji(bot)} ${bot}.` : `You win! I chose ${getEmoji(bot)} ${bot}.`
                case "paper":
                    return bot === "scissors" ? `You lose! I chose ${getEmoji(bot)} ${bot}.` : `You win! I chose ${getEmoji(bot)} ${bot}.`
                case "scissors":
                    return bot === "rock" ? `You lose! I chose ${getEmoji(bot)} ${bot}.` : `You win! I chose ${getEmoji(bot)} ${bot}.`
            }
        }
        interaction.reply(result(choice, botChoice));
    },
};