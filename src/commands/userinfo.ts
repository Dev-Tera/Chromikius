import { EmbedBuilder } from "discord.js";
import { Command } from "../structures/Command";

export default new Command({
    data: {
        name: "userinfo",
        description: "Zeigt Informationen über einen User an",
        options: [
            {
                type: 6,
                name: "member",
                description: "Member dessen Info angezeigt werden soll",
            },
        ],
    },
    userPermissions: [],
    botPermissions: [],
    allowDm: false,
    execute: async (client, interaction) => {
        const input_member = interaction.options.get("member")

        if (input_member === null) { 
            var member = interaction.user
        } else {
            var member = input_member.user
        }

        const guildMember = await interaction.guild.members.fetch(member.id)
        
        var roles = ""
        guildMember.roles.cache.forEach(role => {
            if (role.name === "@everyone") return

            if (roles === undefined) {
                roles = "<@&" + role.id + "> "
            } else {
                roles += "<@&" + role.id + "> "
            }
        })

        const joinedAt = guildMember.joinedAt.getDay() + "." + guildMember.joinedAt.getMonth().toString() + "." + guildMember.joinedAt.getFullYear().toString()

        if (guildMember.premiumSince === null) {
            var premiumSice = "0"
        } else {
            var premiumSice = guildMember.premiumSince.toString()
        }

        const embed = new EmbedBuilder()
            .setColor("#ff9e00")
            .setTitle(guildMember.displayName)
            .setThumbnail(member.avatarURL())
            .addFields(
                { name: "Name", value: member.username + "#" + member.discriminator, inline: true },
                { name: "ID", value: String(member.id), inline: true },
                { name: "Serverbeitritt", value: joinedAt, inline: true },
                { name: "Booster seit", value: premiumSice, inline: true }
            )

        if (roles != "") {
            embed.addFields({ name: "Rollen", value: roles, inline: true })
        }

        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
})
