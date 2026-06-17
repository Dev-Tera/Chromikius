import { EmbedBuilder } from "discord.js";
import { Command } from "../structures/Command";
import Database from "../utils/Database";
import { disableCommand } from "../utils/AvailableCommands";

export default new Command({
    data: {
        name: "disable",
        description: "Deaktiviert einen Command",
        options: [
            {
                type: 3,
                name: "command",
                description: "Der Command der deaktiviert werden soll",
                required: true
            }
        ]
    },
    userPermissions: ["Administrator"],
    botPermissions: [],
    allowDm: false,
    execute: async (client, interaction) => {
        const command = interaction.options.get("command").value as string

        if (client.commands.has(command)) {
            if (await Database.disableCommand(command)) {
                disableCommand(command)


                const embed = new EmbedBuilder()
                    .setColor("#03ff46")
                    .setTitle("`" + command + "` wurde deaktiviert")
                interaction.reply({ embeds: [embed] })
            } else {
                const embed = new EmbedBuilder()
                    .setColor("#fc030b")
                    .setTitle("`" + command + "` ist bereits deaktiviert")
                interaction.reply({ embeds: [embed] })
            }
        } else {
            const embed = new EmbedBuilder()
                .setColor("#fc030b")
                .setTitle("Der Command `" + command + "` existiert nicht")
            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
})
