import { EmbedBuilder } from "discord.js";
import { Command } from "../structures/Command";
import Database from "../utils/Database";

export default new Command({
    data: {
        name: "clearwarnlevel",
        description: "Setzt das Warnlevel eines Users auf 0",
        options: [
            {
                type: 6,
                name: "member",
                description: "Member der verwarnt werden soll",
                required: true,
            },
        ]
    },
    userPermissions: ["ManageRoles", "KickMembers", "BanMembers"],
    botPermissions: [],
    allowDm: false,
    execute: async (client, interaction) => {
        const member = interaction.options.get("member").user

        const warnlevel = await Database.warnsystem_get_stats(member.id)

        if (warnlevel === undefined) {
            const embed = new EmbedBuilder()
                .setColor("#fc030b")
                .setTitle(member.username + " hat keine Verwarnungen")
            interaction.reply({ embeds: [embed] })
        } else {
            await Database.warnsystem_clear_warnlevel(member.id)
            interaction.reply(`Das Warnlevel von ${member.username} wurde auf 0 gesetzt`)
        }
    }
})
