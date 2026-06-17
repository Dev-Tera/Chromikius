import { AttachmentBuilder, EmbedBuilder } from "discord.js"
import { Command } from "../structures/Command"
import { userLevelStats } from "../types/stats"
import Database from "../utils/Database"
import { createCanvas, loadImage, registerFont } from "canvas"

export default new Command({
    data: {
        name: "rank",
        description: "Zeigt dein Level an",
        options: [
            {
                type: 6,
                name: "member",
                description: "Member dessen Level angezeigt werden soll"
            }
        ],
    },
    userPermissions: [],
    botPermissions: [],
    allowDm: true,
    execute: async (client, interaction) => {
        var interactionMember = interaction.options.get("member")

        if (interactionMember) {
            var member = interactionMember.user
        } else {
            member = interaction.user
        }

        if (member.bot) {
            const embed = new EmbedBuilder()
                .setColor("#fc030b")
                .setTitle("Bots können nicht leveln")
            
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return
        }

        const owner: Array<string> = ["578087448341643267", "573598260229439503"]
        if (owner.includes(member.id)) {
            const embed = new EmbedBuilder()
                .setColor("#fc030b")
                .setTitle("Die Owner können nicht leveln")
        
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return
        }

        const stats: userLevelStats = await Database.levelsystem_get_stats(member.id)
        if (stats === undefined) {
            const embed = new EmbedBuilder()
                .setColor("#fc030b")
                .setTitle("Dieser User hat noch keine Nachricht verfasst")
            await interaction.reply({ embeds: [embed], ephemeral: true })
            return
        }

        registerFont(__dirname + "../../../assets/fonts/RobotoMono-VariableFont_wght.ttf", { family: "Roboto Mono" })
        const canvas = createCanvas(900, 300)
        const ctx = canvas.getContext("2d")

        ctx.font = "50px Roboto Mono"

        ctx.drawImage(await loadImage(`${__dirname}/../../assets/images/background${Math.floor(Math.random() * 5) +1}.png`), 0, 0)

        ctx.fillRect(40, 40, 220, 220)

        ctx.drawImage(await loadImage(member.displayAvatarURL({ extension: "jpeg"})), 50, 50, 200, 200)

        ctx.fillStyle = "#ffffff"

        const labelTextHeight = 40 + ctx.measureText("Level:Rank:xp:").actualBoundingBoxAscent + ctx.measureText("Level:Rank:xp:").actualBoundingBoxDescent
        const textHeight = labelTextHeight + 20 + ctx.measureText("100100100").actualBoundingBoxAscent + ctx.measureText("100010001000").actualBoundingBoxDescent

        ctx.fillText("Level:", 300, labelTextHeight)
        ctx.fillText(stats.level.toString(), 300, textHeight)

        ctx.fillText("Rank:", 500, labelTextHeight)
        ctx.fillText(stats.rank.toString(), 500, textHeight)

        ctx.fillText("xp:", 700, labelTextHeight)
        ctx.fillText(stats.xp.toString(), 700, textHeight)

        const levelUp = stats.level * stats.level
        const currentLevelUp = (stats.level - 1) * (stats.level - 1)
        const requiredXpInPercent = 100 / (levelUp - currentLevelUp) * (stats.xp - currentLevelUp)
        const requiredSymbols = requiredXpInPercent / 10

        var progressBar = ""
        var a = 1
        while (a <= requiredSymbols) {
            if (progressBar === undefined) {
                progressBar = "[]"
            } else {
                progressBar += "[]"
            }
            a += 1
        }

        while (progressBar.length < 20) {
            progressBar += "--"
        }

        ctx.fillText("|", 300, 240)
        const lineWidth = ctx.measureText("|").width

        ctx.font = "40px Roboto Mono"
        const progressBarTextWidth = ctx.measureText(progressBar).width
        ctx.fillText(progressBar, 300 + lineWidth, 240)

        ctx.font = "50px Roboto Mono"
        ctx.fillText("|", 300 + lineWidth + progressBarTextWidth, 240)

        await interaction.reply({ files: [new AttachmentBuilder(canvas.toBuffer("image/jpeg"), { name: member.displayName + ".jpeg" })] })
    }
})
