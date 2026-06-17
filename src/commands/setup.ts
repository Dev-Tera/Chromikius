import { EmbedBuilder } from "discord.js"
import { Command } from "../structures/Command"

export default new Command({
    data: {
        name: "setup",
        description: "Kevin Chromiks Setup",
    },
    userPermissions: [],
    botPermissions: [],
    allowDm: true,
    execute: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setColor("#ff9e00")
            // .setTitle("Kevin Chromik's Setup")
            .setDescription(`[Kevin Chromik's Setup](https://kchromik.notion.site/Kevin-Chromik-Equipment-5a1d35852f6d4bf88a86aa468b64fb2d?pvs=74)`)

        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
})
