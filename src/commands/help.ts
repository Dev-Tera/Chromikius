import { Command } from "../structures/Command";
import { EmbedBuilder, TextChannel, User } from "discord.js";
import fs from "fs"

export default new Command({
	data: {
		name: "help",
		description: "Antwortet mit einer Hilfe zu den Commands",
		options: [
			{
				type: 3,	//3 = STRING
				name: "command",
				description: "Enter a command"
			}
		],
	},
    userPermissions: [],
    botPermissions: [],
	allowDm: true,
    execute: async (client, interaction) => {
		const commandOption = interaction.options.get("command")

		if(commandOption) {
			var input_command = commandOption.value as any
		} else {
			var input_command = null
		}

        var rawdata = fs.readFileSync("../../assets/command-descriptions.json").toString()
    	var commands = JSON.parse(rawdata)

		if (input_command === null) {
			const embed = new EmbedBuilder()
			.setColor("#ff9e00")
			.setTitle("Commands")
			.setDescription("Gebe `help [command]` ein oder reagiere auf die Nachricht um mehr Informationen über einen Command zu erhalten")

			const cmd_group_emojis = {
                "user_cmds": "👤",
				"level_cmds": "⬆",
                "mod_cmds": "👮",
				"warn_cmds": "⚠",
				"admin_cmds": "🅰️"
            }

			for (cmd_group in commands) {
				var cmd_group_name = cmd_group.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
				cmd_group_name = cmd_group_name.replace("_", " ")
				cmd_group_name = cmd_group_name.replace("cmds", "Commands")
				cmd_group_name = cmd_group_emojis[String(cmd_group)] + " | " + cmd_group_name
			
				var value = ""
				for (command in commands[String(cmd_group)]) {
					value += command + "\n"
				}

				value = "```\n" + value + "```"

				embed.addFields({ name: cmd_group_name, value: value, inline: true })
			}

			const msg = (await interaction.reply({ embeds: [embed], fetchReply: true }))

			const channel = await client.channels.fetch(msg.channelId) as TextChannel
			const message = await channel.messages.fetch(msg.id)

			const allowed_reactions = []
			Object.keys(cmd_group_emojis).forEach(key => {
				allowed_reactions.push(cmd_group_emojis[key])
			})
			
			msg.react("👤")
			.then(() => msg.react("⬆")).catch((error) => { if(error.code === 10008) return })
			.then(() => msg.react("👮")).catch((error) => { if(error.code === 10008) return })
			.then(() => msg.react("⚠")).catch((error) => { if(error.code === 10008) return })
			.then(() => msg.react("🅰️")).catch((error) => { if(error.code === 10008) return })
			
			const filter = (reaction, user: User) => {
				if (user.id === interaction.user.id) {
					if (allowed_reactions.includes(reaction.emoji.name)) {
						return true
					}
				}

				return false
			}

			msg.awaitReactions({ filter, max: 1, time: 1000 * 30, errors: ["time"] })
			.then(collected => {
				const reaction = collected.first()
				msg.delete()

				const reversed_cmd_group_emojis = {}
				Object.keys(cmd_group_emojis).forEach(key => {
					reversed_cmd_group_emojis[cmd_group_emojis[key]] = key
				})

				const cmd_group = reversed_cmd_group_emojis[reaction.emoji.name]

				var cmd_group_name = cmd_group.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
				cmd_group_name = cmd_group_name.replace("_", " ")
				cmd_group_name = cmd_group_name.replace("cmds", "Commands")
				cmd_group_name = cmd_group_emojis[String(cmd_group)] + " | " + cmd_group_name

				var description =""
				for (var command in commands[cmd_group]) {
					description += `**${command}**\n${commands[cmd_group][command]}\n\n`
				
				}
				const embed = new EmbedBuilder()
					.setColor("#ff9e00")
					.setTitle(cmd_group_name)
					.setDescription(description)
				interaction.channel.send({ embeds: [embed] })
			})
			.catch(collected => {
				msg.reactions.removeAll()
					.catch(error => {
						if (error.code === 50003) return
						else console.error('Failed to clear reactions:', error)
				});
			});
		} else {
			var command_name = null
			var command_description = null
			for (var cmd_group in commands) {
				for (var command in commands[cmd_group]) {
					if (command.toLowerCase().split(" ")[0] === input_command.toLowerCase()) {
						command_name = command.split(" ")[0]
						command_description = commands[cmd_group][command]
					}
				}
			}

			const embed = new EmbedBuilder()

			if (command_name === null && command_description === null) {
				embed.setColor("#fc030b")
					.setTitle(`Der Command ${"`" + input_command + "`"} existiert nicht`)
			} else {
				embed.setColor("#ff9e00")
				.setTitle(command_name)
				.setDescription(command_description)
			}

			await interaction.reply({ embeds: [embed] })
		}
    }
})
