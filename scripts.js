const Discord = require('discord.js');
const puppeteer = require('puppeteer');
let jmespath = require('jmespath');
const dir = process.env.DIR || "./JSON";
var channels = require(dir + '/channels.json');
let adminUser;
module.exports = {

    getOverframe: async function (url, channel, msg) {
        const browser = await puppeteer.launch({
            defaultViewport: { width: 1160, height: 1080 },
            headless: true,
            args: [
                '--ignore-certificate-errors',
                '--no-sandbox',
                '--disable-infobars',
                '--disable-setuid-sandbox',
                '--window-size=1160,1200',
                '--start-maximized',
                "--disable-gpu"],
            //      slowMo: 250, // slow down by 1550ms
        });
        path = dir + "/" + url.replace(/https:\/\//, "").replace(/http:\/\//g, "").replace(/\\/g, "_").replace(/\//g, "_")
        await this.grabpage(browser, url, path, channel, msg), await browser.close();
    },

    grabpage: async function (browser, url, path, channel, msg) {
        const page = await browser.newPage()
        await page.goto(url);
        const title = await page.title();
        var author;
        var itemImage;
        try {
            element = await page.$('a[rel="author"]');
            author = await page.evaluate(element => element.textContent, element);
            element = await page.$('.BuildHeader_itemTexture__3sXa9 a img')
            itemImage = await page.evaluate(element => element.srcset, element);
            itemImage = (itemImage.toString().indexOf(",") > -1 ? itemImage.toString().split(",")[0] : itemImage)
        }
        catch (error) {
            attachment = new Discord.MessageAttachment(Buffer.from(error.message + "\n" + error.stack, 'utf-8'), 'error.log');
            errorMessageString = "channel: " + channel + "\nurl: " + url + "\nusername: " + msg.author.username + "\ncontent: " + msg.content
            msg.reply("oh no something went wrong, please try again.")
            adminUser.send("Error at " + new Date(), attachment);
            return
        }


        var screenshotHeight = 0
        try {
            await page.waitForSelector('.ArcaneMod_arcaneMod__1QJcU', {
                timeout: 1000
            })
            screenshotHeight = 700;
        } catch (error) {
            try {
                await page.waitForSelector('.ArcaneModSlot_arcaneModSlot__2pGBS', {
                    timeout: 1000
                })
                screenshotHeight = 560;
            } catch (error) {
                screenshotHeight = 510;
            }
        }

        var mr = ""
        var forma = ""
        var endo = ""
        try {
            element = await page.$('.BuildHeader_masteryRequired__1lHa_')
            mr = await page.evaluate(element => element.innerText, element);
        } catch {
            mr = "0"
        }

        try {
            element = await page.$('.FormaButton_formaButton__3ykK7')
            forma = await page.evaluate(element => element.innerText, element);
        } catch {
            forma = "0"
        }

        try {
            element = await page.$('.BuildHeader_endoRequired__3zgqv')
            endo = await page.evaluate(element => element.innerText, element);
        } catch {
            mendor = "0"
        }
        var imageBuffer

        await page.addScriptTag({
            url: 'https://code.jquery.com/jquery-3.2.1.min.js'
        }), await page.evaluate(() => {
            try {
                $('#gdpr-consent-tool-wrapper').remove();
            } catch { }
        }), await page.evaluate(() => {
            try {
                $('.BuildHeader_buildDataWrapper__s6N5p').remove();
            } catch { }
        }), await page.evaluate(() => {
            try {
                $('.BuildCalculatorWrapper_breadcrumbsWrapper__3slL6').remove();
            } catch { }
        }), await page.evaluate(() => {
            try {
                $('.BuildCalculatorWrapper_build__15pHM').children[0].remove();
            } catch { }
        }), await page.evaluate(() => {
            try {
                $('.Tabs_tabs__BWkiM').remove();
            } catch { }
        }), await page.evaluate(() => {
            try {
                $('.Footer_footer__1_KSh').remove();
            } catch { }
        }), await page.evaluate(() => {
            try {
                $('.Header_header__fqqrS').remove();
            } catch { }
        }), await page.evaluate(() => {
            try {
                $('.styles_adBottomVideoContainer__CuCMn').remove();
            } catch { }
        }), await page.evaluate(() => {
            try {
                $('#__next').css("margin-top", 0)
            } catch { }
        }).then(imageBuffer = await this.getScreenshot(page, screenshotHeight))
            , await page.close(), await this.sendMessageFile(channel, imageBuffer, url, title, author, itemImage, mr, forma, endo, msg);
    },

    sendMessageFile: async function (channel, buildImage, url, title, author, itemImage, mr, forma, endo, msg) {
        try {

            const buildImageAttachment = new Discord.MessageAttachment(buildImage, 'buildImageAttachment.png');
            attachment = new Discord.MessageAttachment(Buffer.from(buildImage), 'build.png');

            const embed = new Discord.MessageEmbed()
                .setTitle(title)
                .attachFiles(attachment)
                .setImage('attachment://build.png')
                .setColor("#ab0be6")
                .setURL(url)
                .setAuthor(author, itemImage, url)
                .setThumbnail(itemImage)
                .addField("Requires Mastery Rank:", mr)
                .addField("Formas Used:", forma)
                .addField("Endo Required:", endo)
                .setTimestamp(new Date())
            await channel.send({ embed }).then(msg.delete());

        } catch (error) {
            attachment = new Discord.MessageAttachment(Buffer.from(error.message + "\n" + error.stack, 'utf-8'), 'error.log');
            errorMessageString = "channel: " + channel + "\nbuildImage: " + buildImage + "\nurl: " + url + "\ntitle: " + title + "\nauthor: " + author + "\nitemImage: " + itemImage + "\nmr: " + mr + "\nforma: " + forma + "\nendo: " + endo + "\nusername: " + msg.author.username + "\ncontent: " + msg.content
            msg.reply("oh no something went wrong, please try again.")
            adminUser.send("Error at " + new Date(), attachment);
        }

    },
    checkChannel: function (botName, channelID, permission) {
        //console.log(botName + channelID + permission);
        var searchString = '@."' + channelID + '"' + '.permissions."' + botName + '"'
        var result = jmespath.search(channels, searchString);
        if (result != null && result != "" && result.includes(permission)) {
            return true;
        } else {
            return false;
        }

    },
    replyToMessage: function (msg) {
        msg.reply("It looks like your message contains a link to a build on overframe.gg, if you post the URL on its own I can help share the details quicker.")
    },
    setAdminUser: function (user) {
        adminUser = user
    },
    getAdminUser: function () {
        return adminUser
    },
    getScreenshot: async function (page, screenshotHeight) {
        return await (page.screenshot({
            clip: {
                x: 0,
                y: 0,
                width: 1160,
                height: screenshotHeight
            }
        }))
    }

}
