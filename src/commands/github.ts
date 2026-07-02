import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Command from "../structures/Command";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("github")
        .setDescription("Link zu Kevin Chromiks Github Profile und dem Repository dieses Bots"),
    userPermissions: [],
    botPermissions: [],
    allowDm: true,
    execute: async (client, interaction) => {
        const embed = new EmbedBuilder()
                .setColor("#ff9e00")
                .setTitle("GitHub")
                .setDescription("[Kevin Chromiks Account](https://github.com/kchromik)\n[Repository vom Bot](https://github.com/Dev-Tera/Chromikius)")
            
        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
})
