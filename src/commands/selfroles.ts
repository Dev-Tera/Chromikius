import { EmbedBuilder, SlashCommandBuilder } from "discord.js"
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
        await interaction.deferReply()
        const selfroles = await Database.selfroles.getAll()

        let embed: EmbedBuilder
        if (selfroles.length == 0) embed = new EmbedBuilder().setTitle("Es sind keine Selfroles registriert").setColor("#ff9e00")
        else embed = await createSelfroleEmbed("Selfroles", selfroles, interaction.guild)

        interaction.editReply({ embeds: [embed] })
    }
})
