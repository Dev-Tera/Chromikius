import { ChatInputApplicationCommandData, ChatInputCommandInteraction, PermissionResolvable } from "discord.js"
import { ExtendedClient } from "./Client"

export type CommandProperties = {
    data: ChatInputApplicationCommandData
    userPermissions: Array<PermissionResolvable>
    botPermissions:Array<PermissionResolvable>
    allowDm: boolean
    execute: (client: ExtendedClient, interaction: ChatInputCommandInteraction) => void
}

export class Command {
    constructor(commandProperties: CommandProperties) {
        Object.assign(this, commandProperties)
    }
}
