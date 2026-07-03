import fs from "fs"
import Config from "./utils/Config"
import { REST, Routes } from "discord.js"

async function registerCommands() {
  const guildCommands = []
  const dmCommands = []

  const commandFiles = []
  commandFiles.push.apply(commandFiles, fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.ts')))
  commandFiles.push.apply(commandFiles, fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js')))

  for (const file of commandFiles) {
    const command = await import(`${__dirname}/commands/${file}`)

    if (command.default.allowDm === true || command.default.allowDm === undefined) {
      dmCommands.push(command.default.data)
    }
  }

  for (const file of commandFiles) {
    const command = await import(`${__dirname}/commands/${file}`)
    
    if (!dmCommands.includes(command.default.data)) {
      guildCommands.push(command.default.data)
    }
  }

  const rest = new REST({ version: '10' }).setToken(Config.bot.token);

  (async () => {
    try {
      console.log('Started refreshing application (/) commands.')

      await rest.put(
        Routes.applicationCommands(Config.bot.id),
        { body: dmCommands },
      )

      await rest.put(
        Routes.applicationGuildCommands(Config.bot.id, Config.guild.id),
        { body: guildCommands },
      )

      console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
      console.error(error)
    }
  })()
}

registerCommands()
