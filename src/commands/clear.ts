import { EmbedBuilder, SlashCommandBuilder, TextChannel } from "discord.js";
import delay from "../utils/delay";
import Command from "../structures/Command";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Löscht die letzten Nachrichten")
        .addIntegerOption((opt) => opt.setName("anzahl")
                         .setDescription("Anzahl der letzten Nachrichten welche gelöscht werden sollen")
                         .setRequired(false)),
    userPermissions: ["ManageMessages", "ReadMessageHistory"],
    botPermissions: ["ManageMessages", "ReadMessageHistory"],
    allowDm: false,
    execute: async (client, interaction) => {
        const numToBeDeletedInput = interaction.options.get("anzahl")
        let numToBeDeleted: number
        if (numToBeDeletedInput == null) numToBeDeleted = 1
        else numToBeDeleted = numToBeDeletedInput.value as number

        if (numToBeDeleted <= 0) {
            const embed = new EmbedBuilder()
                .setColor("#fc030b")
                .setTitle("Du musst eine Zahl über 0 angeben")
            interaction.reply({ embeds: [embed], ephemeral: true })
            return
        }

        const messages = await interaction.channel.messages.fetch({ limit: numToBeDeleted })
        await interaction.channel.bulkDelete(messages, true)

        const embed = new EmbedBuilder()
            .setColor("#ff9e00")
            .setTitle(`${numToBeDeleted} Nachrichten wurden gelöscht`)
            .setFooter({ text: "Diese Info wird in 3 sek. gelöscht" })
        interaction.reply({ embeds: [embed] })
        await delay(3000)
        interaction.deleteReply()
    }
})
