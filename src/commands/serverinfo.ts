import { EmbedBuilder } from "discord.js";
import { Command } from "../structures/Command";

export default new Command({
    data: {
        name: "serverinfo",
        description: "Zeigt Informationen über den Server",
    },
    userPermissions: [],
    botPermissions: [],
    allowDm: false,
    execute: async (client, interaction) => {
        const createdAt = interaction.guild.createdAt.getDay() + "." + interaction.guild.createdAt.getMonth().toString() + "." + interaction.guild.createdAt.getFullYear().toString()

        const embed = new EmbedBuilder()
                .setColor("#ff9e00")
                .setTitle(interaction.guild.name)
                .addFields(
                    { name: "Member:", value: String(interaction.guild.memberCount) },
                    { name: "Channel:", value: String(interaction.guild.channels.channelCountWithoutThreads) },
                    { name: "Boosts:", value: String(interaction.guild.premiumSubscriptionCount) },
                    { name: "Servererstellung:", value: createdAt, inline: false },
                    { name: "Serverowner:", value: (await interaction.guild.fetchOwner()).displayName }
                )
                .setThumbnail(interaction.guild.iconURL())
            
        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
})
