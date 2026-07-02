import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "../structures/Command";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Gibt eine Übersicht über die Commands"),
    userPermissions: [],
    botPermissions: [],
	allowDm: true,
    execute: async (client, interaction) => {
        const embed = new EmbedBuilder().setTitle("Commands").setColor("#ff9e00")

        for (const [commandName, command] of client.commands) {
            embed.addFields({ name: commandName, value: command.data.description })
        }

        interaction.reply({ embeds: [embed] })
    }
})
