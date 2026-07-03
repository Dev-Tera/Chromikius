import { Message } from "discord.js";
import Database from "../utils/Database";
import { Event } from "../structures/Event";
import Config from "../utils/Config";

export default new Event("messageCreate", async (message: Message) => {
    if (message.author.bot) return

    const isLevelUp = await Database.levelsystem.update(message.author.id, 1)
    if (isLevelUp) message.react(message.guild.emojis.cache.get(Config.guild.emojiIds.levelUp))

    if (message.channelId === Config.guild.surveyChannelId) {
        message.react(message.guild.emojis.cache.get(Config.guild.emojiIds.surveyYes)).catch(error => { if (error.message !== "Reaction blocked") console.error(error) }).then(() => message.react(message.guild.emojis.cache.get(Config.guild.emojiIds.surveyNo))).catch(error => { if (error.message !== "Reaction blocked") console.error(error)})
    }
})
