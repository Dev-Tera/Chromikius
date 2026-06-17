import { EmbedBuilder } from "discord.js";
import { Command } from "../structures/Command";

export default new Command({
    data: {
        name: "github",
        description: "Link zu Kevin Chromiks GitHub Profile"
    },
    userPermissions: [],
    botPermissions: [],
    allowDm: true,
    execute: async (client, interaction) => {
        const embed = new EmbedBuilder()
                .setColor("#ff9e00")
                .setTitle("Kevin Chromik's GitHub Account:\nhttps://github.com/kchromik")
            
        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
})
