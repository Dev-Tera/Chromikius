import { EmbedBuilder } from "discord.js"
import { Command } from "../structures/Command"
import { disableCommands } from "../utils/AvailableCommands"

export default new Command({
    data: {
        name: "disable",
        description: "Deaktiviere Commands",
        options: [
            {
                type: 3,
                name: "commands",
                description: "Die Commands mit ; getrennt welche deaktiviert werden sollen",
                required: true
            }
        ]
    },
    userPermissions: ["Administrator"],
    botPermissions: [],
    allowDm: false,
    execute: async (client, interaction) => {
        const commandOptions = interaction.options.get("commands").value as string
        const commmandsToDeactivateInput = commandOptions.replace(/\s+/g, "").split(";")

        const commandsToDeactivate = new Array()
        const invalidCommands = new Array()
        commmandsToDeactivateInput.forEach(command => {
            if (client.commands.has(command)) commandsToDeactivate.push(command)
            else invalidCommands.push(command)
        })

        const alreadyDeactivatedCommands = await disableCommands(commandsToDeactivate)

        const disabledCommands = commandsToDeactivate.filter(command => !alreadyDeactivatedCommands.includes(command))

        const embed = new EmbedBuilder().setColor("#03ff46").setTitle("Deaktiviere Commands")

        if (disabledCommands.length != 0) {
            embed.addFields({ name: "✅ Deaktiviert", value: disabledCommands.join("\n") })
        }

        if (alreadyDeactivatedCommands.length != 0) {
            embed.addFields({ name: "ℹ️ Bereits deaktiviert", value: alreadyDeactivatedCommands.join("\n") })
        }

        if (invalidCommands.length != 0) {
            embed.addFields({ name: "❌ Ungültige Commands", value: invalidCommands.join("\n") })
        }

        interaction.reply({ embeds: [embed] })
    }
})
