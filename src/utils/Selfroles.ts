import { Client, EmbedBuilder, Guild, RESTJSONErrorCodes, TextChannel } from "discord.js"
import Config from "./Config"
import Database from "./Database"
import { RowDataPacket } from "mysql2/promise"

export interface Selfrole extends RowDataPacket {
    id: number,
    emoji: string,
    roleId: string, 
    channelId: string,
    messageId: string
}

export class RoleNotFoundError extends Error {
    public code = RESTJSONErrorCodes.UnknownRole
    constructor(roleId: string) {
        super(`Role not found: ${roleId}`)
    }
}

export async function cacheSelfroleMessages(client: Client) {
    const selfroles = await Database.selfroles.getAll()
    const guild = await client.guilds.fetch(Config.guild.id)

    const corruptedSelfroles: Selfrole[] = []
    for (const selfrole of selfroles) {
        try {
            const channel = await guild.channels.fetch(selfrole.channelId)
            if (channel.isTextBased()) await channel.messages.fetch(selfrole.messageId)
            else console.warn(`Selfroles.cacheSelfroleMessages: Cant't cache ${selfrole.messageId}. Provided Channel (${channel.name}, ${channel.id}) is not TextBased`)

        } catch (err) {
            if (err.code == RESTJSONErrorCodes.UnknownChannel) {
                console.warn(`Selfroles.cacheSelfroleMessages: Couldn't cache channel ${selfrole.channelId}`)
            } else if (err.code == RESTJSONErrorCodes.UnknownMessage) {
                console.warn(`Selfroles.cacheSelfroleMessages: Couldn't cache message ${selfrole.channelId} in channel ${(await guild.channels.fetch(selfrole.channelId)).name}`)
            } else {
                console.warn(`Selfroles.cacheSelfroleMessages: Couldn't cache Channel ${selfrole.channelId} and Message ${selfrole.messageId}`)
                console.warn(err)
            }

            corruptedSelfroles.push(selfrole)
        }
    }

    if (corruptedSelfroles.length != 0) {
       const moderationChannel = await guild.channels.fetch(Config.guild.moderationChannelId).catch((err) => {
           console.error("Selfrole:corruptedSelfroles: Couldn't fetch moderationChannel")
       }) 

       if (moderationChannel instanceof TextChannel) {
           const embed = await createSelfroleEmbed("Konnte die Messages oder Channel dieser Selfroles nicht cachen.\nNutze /removeselfroles type:prune um sie zu entfernen", corruptedSelfroles, guild)
           moderationChannel.send({ embeds: [embed] })
       }
    }
}

export async function createSelfroleEmbed(title: string, selfroles: Selfrole[], guild: Guild) {
        const embed = new EmbedBuilder().setTitle(title).setColor("#ff9e00")

        let description = ""
        for (var selfrole of selfroles) {
            let emoji = selfrole.emoji
            if (selfrole.emoji.includes("<")) await guild.emojis.fetch(selfrole.emoji.replace("<", "").replace(">", "").split(":")[2])
                .catch(() => emoji = "⚠️" + selfrole.emoji)

            let role = await guild.roles.fetch(selfrole.roleId) ?? "⚠️" + selfrole.roleId // roles.fetch() returns null for whatever reason
            let channel = await guild.channels.fetch(selfrole.channelId).catch(() => "⚠️" + selfrole.channelId)

            let message: string
            try {
                message = `[Link](${(await (channel as TextChannel).messages.fetch(selfrole.messageId)).url})`
            } catch {
                message = "⚠️" + selfrole.messageId
            }
            
            description += `\n\`#${selfrole.id}\` ${emoji} ${role} ${channel} ${message}`
        }

        if (description != "") embed.setDescription(description)
        embed.setFooter({ text: "Elemente mit ⚠️ markiert, existieren nicht mehr oder der Bot hat keinen Zugriff darauf" })

        return embed
}
