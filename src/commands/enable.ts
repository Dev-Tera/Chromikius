import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { enableCommands } from "../utils/AvailableCommands";
import Command from "../structures/Command";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("enable")
        .setDescription("Aktiviert Commands")
        .addStringOption((opt) => opt.setName("commands")
                        .setDescription("Die Commands mit ; getrennt welche aktiviert werden sollen")
                        .setRequired(true)),
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
