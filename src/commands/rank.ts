import { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } from "discord.js"
import Database from "../utils/Database"
import { createCanvas, loadImage, registerFont } from "canvas"
import { LevelsystemMember } from "../utils/Levelsystem"
import Command from "../structures/Command"

export default new Command({
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Zeigt das Level des members")
        .addUserOption((opt) => opt.setName("member")
                      .setDescription("Member dessen Level angezeigt werden soll")),
    userPermissions: [],
    botPermissions: [],
    allowDm: true,
    execute: async (client, interaction) => {
        var interactionMember = interaction.options.get("member")

        if (interactionMember == null) {
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

        // const stats: levels = await Database.levelsystem_get_stats(member.id)
        const stats: LevelsystemMember = await Database.levelsystem.get(member.id)
        if (stats.level == 0) {
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

        const requiredXpForCurrentLevel = stats.level**2
        const requiredXpForLevelUp = (stats.level+1) ** 2

        const xpProgressPercent = 100 / (requiredXpForLevelUp - requiredXpForCurrentLevel) * (stats.xp - requiredXpForCurrentLevel)

        const requiredSymbols = xpProgressPercent / 10

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
