var scripts = require('./scripts.js')
module.exports = {
    getBuild: function (command, bot, user, userID, channelID, messageReceived, msg) {
        //console.log("getBuild script")
        var messages = messageReceived.toString().split("\n");

        messages.forEach(function (message) {
            args = message.split(' ');
            const channel = bot.channels.cache.get(channelID);
            //console.log("starting")
            if (args != null) {
                url = args[0];
                scripts.getOverframe(url, channel, msg)
            } else {
                //console.log("silent error")
            }
            return true;
        })
    },
    replyToMessage: function (command, bot, user, userID, channelID, messageReceived, msg) {
        //console.log("replyToMessage script")
        var messages = messageReceived.toString().split("\n");

        messages.forEach(function (message) {
            args = message.split(' ');
            const channel = bot.channels.cache.get(channelID);
            //console.log("replying")
            if (args != null) {
                url = args[0];
                scripts.replyToMessage(msg)
            } else {
                //console.log("silent error")
            }
            return true;
        })
    }
}