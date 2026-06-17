import { Command } from "../structures/Command"
import { createSelfroleEmbed } from "../utils/Selfroles"

export default new Command({
    data: {
        name: "selfroles",
        description: "Listet alle Selfroles auf",
    },
    userPermissions: [],
    botPermissions: [],
    allowDm: true,
    execute: async (client, interaction) => {
        interaction.reply({ embeds: [await createSelfroleEmbed(interaction, "")] })
    }
})
