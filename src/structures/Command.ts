import { ChatInputCommandInteraction, PermissionResolvable, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js"
import { ExtendedClient } from "./Client"

export default class Command {
        public data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
        public userPermissions: Array<PermissionResolvable>
        public botPermissions: Array<PermissionResolvable>
        public allowDm: boolean
        public execute: (client: ExtendedClient, interaction: ChatInputCommandInteraction) => void

    constructor(params: {
        data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
        userPermissions: Array<PermissionResolvable>,
        botPermissions: Array<PermissionResolvable>,
        allowDm: boolean,
        execute: (client: ExtendedClient, interaction: ChatInputCommandInteraction) => void
    }) {
        Object.assign(this, params)
    }
}
