import { Message, EmbedBuilder, TextChannel } from "discord.js";
import { Command } from "../structures/Command";
import Database from "../utils/Database";

export default new Command({
    data: {
        name: "addselfrole",
        description: "Verändere die Selfroles",
        options: [
            {
                type: 3,
                name: "emoji",
                description: "Das Emoji welches registriert werden soll",
                required: true,
            },
            {
                type: 8,
                name: "role",
                description: "Die Rolle die vergeben werden soll",
                required: true
            },
            {
                type: 7,
                name: "channel",
                description: "Der Channel in dem die Nachricht ist",
                required: true
            },
            {
                type: 3,
                name: "messageid",
                description: "Die Id der Nachricht auf die reagiert werden soll",
                required: true
            }
        ]
    },
    userPermissions: ["Administrator"],
    botPermissions: ["AddReactions", "ManageRoles"],
    allowDm: false,
    execute: async (client, interaction) => {
        const emoji = String(interaction.options.get("emoji").value)
        const role = interaction.options.get("role").role
        const channel = interaction.options.get("channel").channel as TextChannel
        const messageId = String(interaction.options.get("messageid").value)

        console.log(channel.type)
        // if (/*channel.type != "GUILD_TEXT"*/ true) {
        //     const embed = new EmbedBuilder()
        //         .setColor("#fc030b")
        //         .setTitle("Du musst einen Text-Channel angeben")
        //     interaction.reply({ embeds: [embed], ephemeral: true })
        //     return
        // }
        //
        // const message = await channel.messages.fetch(messageId).catch(error => {
        //     if (error.code === 10008) {
        //         const embed = new EmbedBuilder()
        //             .setColor("#fc030b")
        //             .setTitle("Die Nachricht konnte mit der angegebenen Id nicht gefunden werden")
        //
        //         interaction.reply({ embeds: [embed], ephemeral: true })
        //     } else {
        //         throw error
        //     }
        // }) as Message
        //
        // if (!message) return
        //
        // message.react(emoji).catch(error => {
        //     if (error.code === 10014) {
        //         const embed = new EmbedBuilder()
        //             .setColor("#fc030b")
        //             .setTitle("Du hast kein Emoji angegeben")
        //
        //         interaction.reply({ embeds: [embed], ephemeral: true })
        //         return
        //     } else {
        //         throw error
        //     }
        // })
        //
        // const id = await Database.selfrole_add(emoji, role.id, channel.id, messageId)
        // cacheMessages(client)
        //
        // const embed = new EmbedBuilder()
        //     .setColor("#03ff46")
        //     .setTitle("Selfrole registriert")
        //     .setDescription("`#" + id + "` " + emoji + " " + `${role}` + " " + `${channel}` + ` [MessageLink](${message.url})`)
        // interaction.reply({ embeds: [embed] })
    }
})
