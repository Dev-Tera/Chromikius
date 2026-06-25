import { Event } from "../structures/Event"
import Database from "../utils/Database"

export default new Event("messageReactionRemove", async (reaction, user) => {
    if (!reaction.message.inGuild()) return

    if (user.bot) return
    const member = await reaction.message.guild.members.fetch(user.id)
    var selfroles = await Database.selfroles.get(reaction.emoji.name, reaction.message.id)

    for (const selfrole of selfroles) {
        try {
            member.roles.remove(await reaction.message.guild.roles.fetch(selfrole.roleId))
        } catch (err) {
            console.error("messageReactionAdd: Couldn't remove selfrole")
            console.error(err)
        }
    }
})
