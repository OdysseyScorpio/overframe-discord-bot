const Discord = require('discord.js');
var logger = require('winston');
const dir = process.env.DIR || "./JSON";
var auth = require(dir + '/auth.json');
var scripts = require('./scripts.js')
var messageScript = require('./messageScript.js')
var runningState = ""

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
const bot = new Discord.Client();
process.setMaxListeners(0);
bot.login(auth.token);
bot.on('ready', () => {
    var adminUser = bot.users.cache.get('353894762761289728');
    scripts.setAdminUser(adminUser);
    console.log(`Logged in as ${bot.user.tag}!`);
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.tag + ' - (' + bot.user.id + ')');
    if (messageScript.getCommand() == "$") {
        runningState = bot.user.username + " running in debug"
        adminUser.send("UniBot is online")
    } else {
        runningState = bot.user.username + " has been restarted"
        adminUser.send("UniBot is online")
    }

    bot.user.setPresence(
        {
            activity:
                { name: 'Warframe' }, status: 'online'
        });

});
bot.on('message', msg => {
    var channelID = (msg.channel.id ? msg.channel.id : Message.channel.TextChannel.id)

    messageScript.message(bot, msg.author.username, msg.author.id, channelID, msg.content, msg);
});
