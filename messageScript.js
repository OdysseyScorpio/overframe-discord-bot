var scripts = require('./scripts.js')
var uniFrame = require('./uniFrame.js')
var command = process.env.CMD || "$";
module.exports = {
    message: function (bot, user, userID, channelID, messageReceived, msg) {
        var botName = (bot.user.username)
        var done = false

        var url;
        try {
            url = new URL(messageReceived.trim());
        } catch (_) {
            //console.log("Not just a URL")
        }

        isURL = (url != null ? url.protocol === "http:" || url.protocol === "https:" : false);
        isOverframe = (url != null ? url.hostname === "overframe.gg" : false);
        isBuild = (url != null && url.pathname.indexOf("/build/") > -1 ? true : (messageReceived.indexOf("overframe.gg/build/") > -1 ? true : false))

        if (isURL && isOverframe && isBuild) {
            if (scripts.checkChannel(botName, channelID, "uniFrame")) {
                done = uniFrame.getBuild(command, bot, user, userID, channelID, messageReceived, msg)
            }
        } else if (isBuild) {
            done = uniFrame.replyToMessage(command, bot, user, userID, channelID, messageReceived, msg)
        }
    },
    getCommand: function () {
        return command
    }
}