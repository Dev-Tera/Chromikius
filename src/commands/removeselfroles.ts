import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, SlashCommandBuilder, TextChannel } from "discord.js";
import Database from "../utils/Database";
import { createSelfroleEmbed, Selfrole } from "../utils/Selfroles";
import Command from "../structures/Command";

export default new Command({
    data: new SlashCommandBuilder()
        .setName("removeselfroles")
        .setDescription("Löscht Selfroles")
        .addStringOption((opt) => opt.setName("type")
                        .setDescription("Welcher Typ von Selfroles sollen entfernt werden?")
                        .setRequired(true)
                        .addChoices(
                            { name: "Id's", value: "ids" },
                            { name: "Prune: Entferne kaputte Selfroles", value: "prune"},
                            { name: "All", value: "all"}
                        ))
        .addStringOption((opt) => opt.setName("ids")
                        .setDescription("Die Id's mit ; getrennt falls Id's als type ausgewählt wurde")),
    userPermissions: ["Administrator"],
    botPermissions: [],
    allowDm: false,
    execute: async (client, interaction) => {
        const type = interaction.options.get("type").value
        
        if (type == "ids") {
            let ids: number[]
            try {
                ids = (interaction.options.get("ids").value as string).split(";").map((id) => Number(id))
                if (ids.includes(NaN)) throw new Error("Invalid input")
            } catch (err) {
                const embed = new EmbedBuilder()
                    .setColor("#fc030b")
                    .setTitle("Du hast keine gültigen Id's angegeben")
                interaction.reply({ embeds: [embed], ephemeral: true })
                return
            }

            const removedSelfroles = await Database.selfroles.remove(ids)

            let embed: EmbedBuilder
            if (removedSelfroles.length == 0) embed = new EmbedBuilder().setTitle("Konnte keine Selfroles mit den angegebenen Id's entfernen").setColor("#fc030b")
            else embed = await createSelfroleEmbed("Entfernte Selfroles", removedSelfroles, interaction.guild)
            
            interaction.reply({ embeds: [embed]})


        } else if (type == "prune") {
            const selfrolesToRemove: Selfrole[] = []
            const selfroles = await Database.selfroles.getAll()
            for (const selfrole of selfroles) {
                try {
                    if (selfrole.emoji.includes("<")) await interaction.guild.emojis.fetch(selfrole.emoji.replace("<", "").replace(">", "").split(":")[2])
                    if (await interaction.guild.roles.fetch(selfrole.roleId) == null) throw new Error("Role not found")
                    const channel = await interaction.guild.channels.fetch(selfrole.channelId) as TextChannel
                    await channel.messages.fetch(selfrole.messageId)
                } catch (err) {
                    selfrolesToRemove.push(selfrole)
                }
            }

            const removedSelfroles = await Database.selfroles.remove(selfrolesToRemove.map((selfrole) => selfrole.id))

            let embed: EmbedBuilder
            if (removedSelfroles.length == 0) embed = new EmbedBuilder().setTitle("Es gibt keine kaputten Selfroles").setColor("#fc030b")
            else embed = await createSelfroleEmbed("Pruned Selfroles", removedSelfroles, interaction.guild)

            interaction.reply({ embeds: [embed] })


        } else if (type == "all") {
            const embed = new EmbedBuilder().setTitle("Bist du sicher das du alle Selfroles löschen willst?").setColor("#ff9e00")
            const confirmButton = new ButtonBuilder().setCustomId("ConfirmRemoveAllSelfroles").setLabel("Ja alle löschen").setStyle(ButtonStyle.Danger)
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton)
            const response = await interaction.reply({ embeds: [embed], components: [row], withResponse: true})

            try {
                await response.resource.message.awaitMessageComponent({
                    componentType: ComponentType.Button,
                    filter: (buttonInteraction) => buttonInteraction.user.id == interaction.user.id
                                                && buttonInteraction.customId == "ConfirmRemoveAllSelfroles",
                    time: 10000
                })

                const removedSelfroles = await Database.selfroles.removeAll()

                let embed: EmbedBuilder
                if (removedSelfroles.length != 0) embed = await createSelfroleEmbed("Alle Selfroles gelöscht", removedSelfroles, interaction.guild)
                else embed = new EmbedBuilder().setTitle("Konnte keine Selfroles löschen").setColor("#fc030b")

                interaction.editReply({ embeds: [embed], components: [] })
            } catch (err) {
                embed.setFooter({ text: "User hat nicht bestätigt" })
                interaction.editReply({ embeds: [embed], components: [] })
            }
        }
    }
})
