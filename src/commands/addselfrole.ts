import { EmbedBuilder, GuildEmoji, Message, SlashCommandBuilder, TextChannel } from "discord.js"
import { ChannelType, RESTJSONErrorCodes } from "discord-api-types/v10"
import Command from "../structures/Command"
import Database from "../utils/Database"
import { createSelfroleEmbed, Selfrole } from "../utils/Selfroles"

export default new Command({
    data: new SlashCommandBuilder()
        .setName("addselfrole")
        .setDescription("Fügt eine Selfrole hinzu")
        .addStringOption((opt) => opt.setName("emoji")
                         .setDescription("Das Emoji mit dem reagiert werden soll")
                         .setRequired(true))
        .addRoleOption((opt) => opt.setName("role")
                       .setDescription("Die Rolle welche vergeben werden soll")
                       .setRequired(true))
        .addChannelOption((opt) => opt.setName("channel")
                         .setDescription("Der Channel in dem die Nachricht ist")
                         .setRequired(true)
                         .addChannelTypes(ChannelType.GuildText))
        .addStringOption((opt) => opt.setName("messageid")
                        .setDescription("Die ID der Nachricht")
                        .setRequired(true)),
    userPermissions: ["Administrator"],
    botPermissions: ["AddReactions", "ManageRoles"],
    allowDm: false,
    execute: async (client, interaction) => {
        await interaction.deferReply()
        const emojiInput = interaction.options.get("emoji").value as string
        const role = interaction.options.get("role").role
        const channel = interaction.options.get("channel").channel as TextChannel
        const messageId = interaction.options.get("messageid").value as string

        const message = await channel.messages.fetch(messageId).catch(err => {
            const embed = new EmbedBuilder()
                .setColor("#fc030b")
                .setTitle("Du hast eine ungültige Message ID angegeben")
            interaction.editReply({ embeds: [embed] })
        })
        if (!(message instanceof Message)) return

        try {
            let emoji: string | GuildEmoji
            if (emojiInput.includes("<")) emoji = await interaction.guild.emojis.fetch(emojiInput.replace("<", "").replace(">", "").split(":")[2])
            else emoji = emojiInput
            await message.react(emoji)
        } catch (err) {
            const embed = new EmbedBuilder()
                .setColor("#fc030b")

            if (err.code == RESTJSONErrorCodes.UnknownEmoji) {
                embed.setTitle("Du hast kein gültiges Emoji angegeben")
            } else if (err.code == RESTJSONErrorCodes.MaximumNumberOfReactionsReached) {
                embed.setTitle("Die Nachricht hat bereits die maximale Anzahl von Reaktionen (20)")
            } else {
                embed.setTitle("Etwas ist schief gelaufen")
                console.warn("addselfrole: Couldn't react with emoji")
                console.warn(err)
            }

            interaction.editReply({ embeds: [embed] })
            return
        }

        const createdSelfroleId = await Database.selfroles.add(emojiInput, role.id, channel.id, messageId)

        if (createdSelfroleId == null) {
            const embed = new EmbedBuilder()
                .setColor("#fc030b")
                .setTitle("Konnte die Selfrole nicht in der Datenbank speichern")
            interaction.editReply({ embeds: [embed] })
            return
        }

        const embed = await createSelfroleEmbed(
            "Selfrole registriert",
            [{
                id: createdSelfroleId, emoji: emojiInput, roleId: role.id, channelId: channel.id, messageId: messageId
            } as Selfrole],
            interaction.guild,
        )

        interaction.editReply({ embeds: [embed] })
    }
})
