import { RESTJSONErrorCodes } from "discord.js";
import Database from "../utils/Database";
import { Event } from "../structures/Event";
import Config from "../utils/Config";

export default new Event("messageCreate", async (message) => {
    if (message.author.bot) return

    const isLevelUp = await Database.levelsystem.update(message.author.id, 1)
    if (isLevelUp) message.react(await message.guild.emojis.fetch(Config.guild.emojiIds.levelUp)).catch((err) => {
        if (err.code != RESTJSONErrorCodes.ReactionWasBlocked) {
            console.warn("messageCreate:isLevelUp: ", err)
        }
    })

    if (message.channelId === Config.guild.surveyChannelId) {
        try{
            await message.react(await message.guild.emojis.fetch(Config.guild.emojiIds.surveyYes)).then(async () => message.react(await message.guild.emojis.fetch(Config.guild.emojiIds.surveyNo)))
        } catch (err) {
            if (err.code != RESTJSONErrorCodes.ReactionWasBlocked) {
                console.warn("messageCreate:SurveyChannel: ", err)
            }
        }
    }
})
