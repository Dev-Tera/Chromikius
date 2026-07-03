import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "../structures/Command";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("youtube")
        .setDescription("Kevin Chromiks YouTube Kanal"),
    userPermissions: [],
    botPermissions: [],
    allowDm: true,
    execute: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setColor("#ff9e00")
            .setDescription("[Kevin Chromiks YouTube Kanal](https://www.youtube.com/c/KevinChromik)")

        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
})
