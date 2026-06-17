import { EmbedBuilder } from "discord.js";
import { Command } from "../structures/Command";
import Database from "../utils/Database";

export default new Command({
    data: {
        name: "removexp",
        description: "Entfernt xp eines Members",
        options: [
            {
                type: 6,
                name: "member",
                description: "Member von dem xp entfernt werden soll",
                required: true,
            },
            {
                type: 4,
                name: "xp",
                description: "Erfahrung die entfernt werden soll",
                required: true,
            },
        ],
    },
    userPermissions: ["Administrator"],
    botPermissions: [],
    allowDm: false,
    execute: async (client, interaction) => {
        const member = interaction.options.get("member")
        const xpToBeRemoved = interaction.options.get("xp").value as number

        const stats = await Database.levelsystem_get_stats(member.user.id)
        
        if (stats === undefined) {
            const embed = new EmbedBuilder()
                .setColor("#fc030b")
                .setTitle("Dieser User hat noch keine Nachricht verfasst")
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return
        }

        const newXp = stats.xp - xpToBeRemoved
        const newLevel = Math.ceil(Math.sqrt(newXp))
        
        Database.levelsystem_removexp(newXp, newLevel, member.user.id)

        await interaction.reply(`${member.user} wurden ${xpToBeRemoved} xp abgezogen`)
    }
})
