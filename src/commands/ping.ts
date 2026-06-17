import { EmbedBuilder } from "discord.js";
import { Command } from "../structures/Command";

export default new Command({
    data: {
        name: "ping",
        description: "Antwortet mit der Latenz",
    },
    userPermissions: [],
    botPermissions: [],
    allowDm: true,
    execute: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setColor("#ff9e00")
            .setTitle("🏓 Pong!")
            .setDescription(`Latency: ${Date.now() - interaction.createdTimestamp}ms\n
			API Latency: ${Math.round(interaction.client.ws.ping)}ms`)
        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
})
