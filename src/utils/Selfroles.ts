import { Client, EmbedBuilder, Message, TextChannel } from "discord.js"
import Config from "./Config"
import Database from "./Database"
import { RowDataPacket } from "mysql2/promise"

export interface Selfrole extends RowDataPacket {
    id: string,
    emoji: string,
    roleId: string, 
    channelId: string,
    messageId: string
}

export async function cacheSelfroleMessages(client: Client) {
    const selfroles = await Database.selfroles.getAll()
    const guild = await client.guilds.fetch(Config.guild.id)

    for (const selfrole of selfroles) {
        try {
            const channel = await guild.channels.fetch(selfrole.channelId)
            if (channel.isTextBased()) await channel.messages.fetch(selfrole.messageId)
            else console.warn(`Selfroles.cacheSelfroleMessages: Cant't cache ${selfrole.messageId}. Provided Channel (${channel.name}, ${channel.id}) is not TextBased`)

        } catch (err) {
            console.warn(`Selfroles.cacheSelfroleMessages: Couldn't cache Channel: ${selfrole.channelId} and Message: ${selfrole.messageId}`)
        }
    }

    selfroles.forEach(async selfrole => {
        const channel = await guild.channels.fetch(selfrole.channelId) as TextChannel
        const message = await channel.messages.fetch(selfrole.messageId)
    })
}

export async function createSelfroleEmbed(interaction, descriptionHeader){
    const selfroles = await Database.selfroles.getAll()

        var description = descriptionHeader
        for (var selfrole of selfroles) {
            const role = await interaction.guild.roles.fetch(selfrole.roleId)
            const channel = await interaction.guild.channels.fetch(selfrole.channelId) as TextChannel
            const message = (await channel.messages.fetch(selfrole.messageId).catch(error => {
                if (error.code === 10008) {
                    return
                } else {
                    throw error
                }
            })) as Message

            if (description === undefined) {
                description = "`#" + selfrole.id + "` " + selfrole.emoji + ` ${role} ${channel} [MessageLink](${message.url})`
            } else {
                description += "\n`#" + selfrole.id + "` " + selfrole.emoji + ` ${role} ${channel} [MessageLink](${message.url})`
            }
        }
        
        const embed = new EmbedBuilder()
            .setColor("#ff9e00")
            .setTitle("Selfroles")
            .setDescription(description)

        return embed
}
