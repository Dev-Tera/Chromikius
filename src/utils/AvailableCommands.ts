import { CacheType, Client, CommandInteraction, Embed, EmbedBuilder, GuildMember, PermissionResolvable, User } from "discord.js"
import Config from "./Config"
import Database from "./Database"
import { CommandProperties } from "../structures/Command"

let disabledCommands: Array<string> = []

export async function loadDisabledCommands() {
    if (Config.database.required) {
        const loadedDisabledCommands = await Database.getDisabledCommands()

        if (loadedDisabledCommands != undefined) {
            disabledCommands = loadedDisabledCommands
        }
    }
}

export function disableCommand(commandName: string) {
    disabledCommands.push(commandName)
}

export function enableCommand(commandName: string) {
    disabledCommands = disabledCommands.filter(e => e != commandName)
}

export function isCommandDisabled(command: string) {
    return disabledCommands.includes(command)
}

interface MissingCommandPermissions {
    member: Array<PermissionResolvable>
    client: Array<PermissionResolvable>
}

export function missingPermissionFor(command: CommandProperties, member: GuildMember, client: GuildMember): MissingCommandPermissions {
    const missingCommandPermissions: MissingCommandPermissions = {
        member: new Array(),
        client: new Array()
    }

    command.userPermissions.forEach(permission => {
        if (!member.permissions.has(permission)) missingCommandPermissions.member.push(permission)
    })

    command.botPermissions.forEach(permission => {
        if (!client.permissions.has(permission)) missingCommandPermissions.client.push(permission)
    })

    return missingCommandPermissions
}

export function createMissingPermissionEmbed(missingCommandPermissions: MissingCommandPermissions): EmbedBuilder {
        const embed = new EmbedBuilder().setColor("#fc030b").setTitle("Es fehlen Berechtigungen!")
        if (missingCommandPermissions.member.length != 0) embed.addFields({
            name: "Du", value: missingCommandPermissions.member.join("\n")
        })

        if (missingCommandPermissions.client.length != 0) embed.addFields({
            name: "Du", value: missingCommandPermissions.client.join("\n")
        })

        return embed
}
