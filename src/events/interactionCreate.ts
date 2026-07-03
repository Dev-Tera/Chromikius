import { EmbedBuilder, Guild, GuildMember } from "discord.js";
import { client } from "../main";
import { Event } from "../structures/Event"
import { createMissingPermissionEmbed, isCommandDisabled, missingPermissionFor } from "../utils/AvailableCommands";
import Config from "../utils/Config";

let guild: Guild
let clientMember: GuildMember

async function fetchGuildAndClientMember() {
    guild = await client.guilds.fetch(Config.guild.id)
    clientMember = await guild.members.fetch(client.user.id)
}

export default new Event("interactionCreate", async (interaction) => {
    // ---IsValidCommand---------------------------------
    if (!interaction.isChatInputCommand()) return
    const command = client.commands.get(interaction.commandName)
    if (!command) {
        interaction.reply({ content: "Das ist kein gültiger command", ephemeral: true })
        return
    } 

    // ---MissingPermissions?----------------------------
    if (!guild || !clientMember) await fetchGuildAndClientMember()
    let member = interaction.member
    if (!(member instanceof GuildMember)) {
        try {
            member = await guild.members.fetch(interaction.user.id)
        } catch (err) {
            console.warn(interaction.user.username + " tried to use a command without being in the configured guild")
            interaction.reply("Du bist nicht im Server" + guild.name)
            return
        }
    }

    const missingCommandPermissions = missingPermissionFor(
        command,
        member,
        clientMember
    )

    if (missingCommandPermissions.member.length != 0 || missingCommandPermissions.client.length != 0) {
        interaction.reply({ embeds: [createMissingPermissionEmbed(missingCommandPermissions)], ephemeral: true })
        return
    }

    // ---CommandDisabled?------------------------------- 
    if (await isCommandDisabled(command.data.name)) {
        interaction.reply({ embeds: [new EmbedBuilder().setColor("#fc030b").setTitle("Der Command `" + command.data.name + "` ist deaktiviert")], ephemeral: true })
        return
    }

    // ---ExecuteCommand--------------------------------- 
    try {
        command.execute(client, interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true})
    }
})
