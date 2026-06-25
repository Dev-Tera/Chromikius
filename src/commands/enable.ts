import { EmbedBuilder } from "discord.js";
import { Command } from "../structures/Command";
import { disableCommands, enableCommands } from "../utils/AvailableCommands";

export default new Command({
    data: {
        name: "enable",
        description: "Aktivierts Commands",
        options: [
            {
                type: 3,
                name: "commands",
                description: "Die Commands mit ; getrennt welche aktiviert werden sollen",
                required: true
            }
        ]
    },
    userPermissions: ["Administrator"],
    botPermissions: [],
    allowDm: false,
    execute: async (client, interaction) => {
        const commandOptions = interaction.options.get("commands").value as string
        const commmandsToActivateInput = commandOptions.replace(/\s+/g, "").split(";")

        const commandsToActivate = new Array()
        const invalidCommands = new Array()
        commmandsToActivateInput.forEach(command => {
            if (client.commands.has(command)) commandsToActivate.push(command)
            else invalidCommands.push(command)
        })

        const alreadyActivatedCommands = await enableCommands(commandsToActivate)

        const enabledCommands = commandsToActivate.filter(command => !alreadyActivatedCommands.includes(command))

        const embed = new EmbedBuilder().setColor("#03ff46").setTitle("Aktiviere Commands")

        if (enabledCommands.length != 0) {
            embed.addFields({ name: "✅ Aktiviert", value: enabledCommands.join("\n") })
        }

        if (alreadyActivatedCommands.length != 0) {
            embed.addFields({ name: "ℹ️ Bereits aktiviert", value: alreadyActivatedCommands.join("\n") })
        }

        if (invalidCommands.length != 0) {
            embed.addFields({ name: "❌ Ungültige Commands", value: invalidCommands.join("\n") })
        }

        interaction.reply({ embeds: [embed] })
    }
})
