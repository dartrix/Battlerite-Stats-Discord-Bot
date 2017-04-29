
// import modules
const Discord = require('discord.js')
const request = require('request');
const _ = require('lodash');
const config = require('./config.json')

const battleriteapi = require('./services/masterbattleriteie')


// create an instance of a Discord Client, and call it bot
const bot = new Discord.Client();

// the token of your bot - https://discordapp.com/developers/applications/me
const token = config.token;

  bot.on('ready', () => {
    console.log('I am ready!');
  });

// create an event listener for messages
  bot.on('message', message => {

      if(message.author.id != bot.user.id){

        var contentdata = message.content.split(' ');

        if(contentdata[0] === config.prefix + 'btstats' && message.channel.name == config.channel){
            message.channel.startTyping();
          if (contentdata[1] != null || contentdata[1] != undefined) {

            battleriteapi(contentdata[1], function(res){
              if(typeof res == "object"){
                const embed = new Discord.RichEmbed()
                .setTitle(`__${res.data.title}__`)
                .setAuthor(res.data.name.toUpperCase(), res.data.avatar)
                .setColor('#C2311E')
                .setDescription(`**MRV**: ${res.data.mrv}
**Global Rating**: ${res.data.gr}
**Wins**: ${res.data.win}
**Loss**: ${res.data.loss}
**Winrate**: ${res.data.winrate}
                  `)
                .setFooter('Data taken from MasterBattlerite | Made by Dartrix', 'https://masterbattlerite.com/asset/image/favicon.ico')
                .setThumbnail(res.data.avatar)
                /*
                 * Takes a Date object, defaults to current date.
                 */
                .setTimestamp()
                .setURL('')
                .addField('__Solo__',
                  `**Rank**: ${res.data.solo.rank}
**Division**: ${res.data.solo.division}
**Win/Loss**: ${res.data.solo.winloserate}
**Winrate**: ${res.data.solo.statkills}`,true)
                .addField('__2v2__',
                `**Rank**: ${res.data.dual.rank}
**Division**: ${res.data.dual.division}
**Win/Loss**: ${res.data.dual.winloserate}
**Winrate**: ${res.data.dual.statkills}`, true)
                .addField('__3v3__',
                 `**Rank**: ${res.data.standard.rank}
**Division**: ${res.data.standard.division}
**Win/Loss**: ${res.data.standard.winloserate}
**Winrate**: ${res.data.standard.statkills}`, true)

                .addField('__Most Used Champ__',
 `**Name**: ${res.data.mostusedchamp.name}
**Win/Loss**: ${res.data.mostusedchamp.winloserate}
**XP**: ${res.data.mostusedchamp.xp}
**Level**: ${res.data.mostusedchamp.level}
**Winrate**: ${res.data.mostusedchamp.winrate}`, true);
                //message.channel.sendMessage(JSON.stringify(res, null, 2));
                message.channel.sendEmbed(embed);

                message.channel.stopTyping();

              } else if(typeof res == "string"){
                message.channel.stopTyping();
                message.channel.sendMessage(res);
              }
            })

          }// if contentdata[1] is not null or undefined
          else {
            message.channel.sendMessage(`Invalid user or user not found. Commands: /n\`\`${config.prefix}btstats <username>\`\`: get your battlerite stats`);
          }

        }// if message is prefix+btstats and its in the correct channel

        message.channel.stopTyping(true);
      }// author is bot condition

  });

    // log our bot in
bot.login(token);
