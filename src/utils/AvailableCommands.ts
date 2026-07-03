import { EmbedBuilder, GuildMember, PermissionResolvable } from "discord.js"
import Database from "./Database"
import Command from "../structures/Command"

let disabledCommands: Array<string>

async function loadDisabledCommands() {
    disabledCommands = await Database.commands.getDisabled()
}

/**
    * @returns commands that were already disabled
*/
export async function disableCommands(commands: Array<string>): Promise<Array<string>> {
    if (disabledCommands == undefined) await loadDisabledCommands()
    const commandsToDisable = new Array()

    commands.forEach(command => {
        if (!disabledCommands.includes(command)) {
            commandsToDisable.push(command)
        }
    })

    disabledCommands = disabledCommands.concat(commandsToDisable) 
    await Database.commands.disable(commandsToDisable)
    
    return commands.filter(command => !commandsToDisable.includes(command))

}

/**
    * @returns commands that were already enabled
*/
export async function enableCommands(commands: Array<string>): Promise<Array<string>> {
    if (disabledCommands == undefined) await loadDisabledCommands()
    const commandsToEnable = new Array()

    commands.forEach(command => {
        if (disabledCommands.includes(command)) {
            commandsToEnable.push(command)
        }
    })

    disabledCommands = disabledCommands.filter(command => !commandsToEnable.includes(command))
    await Database.commands.enable(commandsToEnable)
    
    return commands.filter(command => !commandsToEnable.includes(command))
}

export async function isCommandDisabled(command: string) {
    if (disabledCommands == undefined) await loadDisabledCommands()
    return disabledCommands.includes(command)
}

interface MissingCommandPermissions {
    member: Array<PermissionResolvable>
    client: Array<PermissionResolvable>
}

export function missingPermissionFor(command: Command, member: GuildMember, client: GuildMember): MissingCommandPermissions {
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
