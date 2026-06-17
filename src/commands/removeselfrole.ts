import { EmbedBuilder, User } from "discord.js";
import { Command } from "../structures/Command";
import Database from "../utils/Database";
import { cacheSelfroleMessages, createSelfroleEmbed, SelfroleStats } from "../utils/Selfroles";

export default new Command({
    data: {
        name: "removeselfrole",
        description: "Löscht eine Selfrole",
        options: [
            {
                type: 3,
                name: "id",
                description: "Die ID der Selfrole die gelöscht werden soll"
            }
        ]
    },
    userPermissions: ["Administrator"],
    botPermissions: [],
    allowDm: false,
    execute: async (client, interaction) => {
        const selfroleId = interaction.options.get("id")

        if (selfroleId) {
            const selfrole = await Database.selfrole_remove(selfroleId.value as string, false) as SelfroleStats
            cacheSelfroleMessages(client)

            const embed = new EmbedBuilder()
                .setColor("#fc030b")

            if (selfrole != undefined) {
                embed.setTitle("Selfrole `#" + selfrole.id + "` wurde gelöscht")
            } else {
                embed.setTitle("Es existiert keine Selfrole mit der id `#" + selfroleId.value + "`")
            }
            
            interaction.reply({ embeds: [embed] })


        } else {
            const selfrolesLength = (await Database.selfrole_getAll()).length

            const descriptionHeader = "Gebe `/removeselfrole [ID]` ein oder reagiere auf diese Nachricht um eine Selfrole zu löschen\nReagiere mit ❌ um alle zu löschen.\n"
            const msg = await interaction.reply({ embeds: [await createSelfroleEmbed(interaction, descriptionHeader)], fetchReply: true}) as any
            
            const allowedReactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "❌"]

            const emojiNames = {
                "1️⃣": 0,
                "2️⃣": 1,
                "3️⃣": 2,
                "4️⃣": 3,
                "5️⃣": 4,
                "6️⃣": 5,
                "7️⃣": 6,
                "8️⃣": 7,
                "9️⃣": 8,
                "❌": "all"
            }

            for (var reaction of allowedReactions) {
                if (emojiNames[reaction] + 1 <= selfrolesLength) {
                    msg.react(reaction)
                }
            }

            msg.react("❌")
            
            const filter = (reaction, user: User) => {
                if (user.id === interaction.user.id) {
                    if (allowedReactions.includes(reaction.emoji.name)) {
                        return true
                    }
                }

                return false
            }

            msg.awaitReactions({ filter, max: 1, time: 1000 * 30, errors: ["time"] })
            .then(async collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === "❌") {
                    const embed = new EmbedBuilder()
                        .setColor("#ff9e00")
                        .setTitle("Sicher dass alle Selfroles gelöschen werden sollen?")
                    const msg = await interaction.channel.send({ embeds: [embed] }) as any

                    msg.react("✅").then(() => msg.react("❌"))

                    const filter = (reaction, user: User) => {
                        if (user.id === interaction.user.id) {
                            if (["✅", "❌"].includes(reaction.emoji.name)) {
                                return true
                            }
                        }
        
                        return false
                    }
        
                    msg.awaitReactions({ filter, max: 1, time: 1000 * 30, errors: ["time"] })
                    .then(async collected => {
                        const answer = collected.first()
                        
                        if (answer.emoji.name === "❌") return
                        await Database.selfrole_remove(emojiNames[reaction.emoji.name], true)
                        cacheSelfroleMessages(client)

                        const embed = new EmbedBuilder()
                            .setColor("#fc030b")
                            .setTitle("Alle Selfroles wurden gelöscht")
                        interaction.channel.send({ embeds: [embed] })
                    })
                } else {
                    const selfrole = await Database.selfrole_remove(emojiNames[reaction.emoji.name], true) as SelfroleStats
                    cacheSelfroleMessages(client)
                    
                    const embed = new EmbedBuilder()
                        .setColor("#fc030b")
                        .setTitle("Selfrole `#" + selfrole.id + "` wurde gelöscht")
                    interaction.channel.send({ embeds: [embed] })
                }
            })
        }
    }
})
