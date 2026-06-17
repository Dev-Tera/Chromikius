import { Event } from "../structures/Event";
import { client } from "../main";
import delay from "../utils/delay";
import { cacheSelfroleMessages } from "../utils/Selfroles";

export default new Event("clientReady", async () => {
    console.log(`The client has been successfully logged in as user ${client.user.username}`)

    // Cache Selfrole messages
    cacheSelfroleMessages(client)

    // Status loop
    const messages = ["/help", "Subscribe to Kevin Chromik :)", "By L3g3nd#0056"]
    while (true) {
        for (const message of messages) {
            client.user.setActivity(message)
            await delay(15000)
        }
    }
})
