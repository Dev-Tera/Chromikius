import { SlashCommandBuilder } from "discord.js"
import Command from "../structures/Command"
import Database from "../utils/Database"
import { createSelfroleEmbed } from "../utils/Selfroles"

export default new Command({
    data: new SlashCommandBuilder()
        .setName("selfroles")
        .setDescription("Listet alle Selfroles auf"),
    userPermissions: [],
    botPermissions: [],
    allowDm: true,
    execute: async (client, interaction) => {
        interaction.reply({ embeds: [await createSelfroleEmbed(await Database.selfroles.getAll(), interaction.guild)] })
    }
})
