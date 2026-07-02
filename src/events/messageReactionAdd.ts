import { EmbedBuilder, RESTJSONErrorCodes, TextChannel } from "discord.js"
import { Event } from "../structures/Event"
import Database from "../utils/Database"
import Config from "../utils/Config"
import { createSelfroleEmbed, RoleNotFoundError } from "../utils/Selfroles"

export default new Event("messageReactionAdd", async (reaction, user) => {
    if (!reaction.message.inGuild()) return
    if (user.bot) return

    let emoji: string
    if (reaction.emoji.id) emoji = `<:${reaction.emoji.name}:${reaction.emoji.id}>`
    else emoji = reaction.emoji.name

    const selfroles = await Database.selfroles.get(emoji, reaction.message.id)

    if (selfroles.length != 0) {
        const member = await reaction.message.guild.members.fetch(user.id)

        for (const selfrole of selfroles) {
            try {
                const role = await reaction.message.guild.roles.fetch(selfrole.roleId)
                if (role == null) throw new RoleNotFoundError(selfrole.roleId)
                await member.roles.add(role)
            } catch (err) {
                let embed: EmbedBuilder
                if (err.code == RESTJSONErrorCodes.UnknownRole) {
                    embed = await createSelfroleEmbed("Konnte die Rolle der Selfrole nicht finden", [selfrole], reaction.message.guild)

                } else if (err.code == RESTJSONErrorCodes.MissingPermissions) {
                    embed = await createSelfroleEmbed("Mir fehlt die Berechtigung die Rolle der Selfrole zu vergeben", [selfrole], reaction.message.guild)
                } else {
                    console.error("messageReactionAdd: Couldn't give selfrole")
                    console.error(err)
                }

                if (embed != undefined) {
                   const moderationChannel = await reaction.message.guild.channels.fetch(Config.guild.moderationChannelId).catch((err) => {
                       console.error("messageReactionAdd:MissingPermissions: Couldn't fetch moderationChannel")
                   }) 

                   if (moderationChannel instanceof TextChannel) {
                       moderationChannel.send({ embeds: [embed] })
                   }
                }
            }
        }
    }
})
