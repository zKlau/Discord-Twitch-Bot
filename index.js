//Bot Start

const Discord = require('discord.js');
const client = new Discord.Client();
const iso = require('iso-639-1')
var fetch = require("cross-fetch");
const { log } = require('console');
const gm = require('gm');

var client_id = "client_id";
var client_secret = 'client_secret';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('type "tw help" for the commands', {
    type : "STREAMING",
    url : "https://www.twitch.tv/mrzklau"
  });
});

client.on('message', msg => {
    if (msg.content.startsWith('tw ')) {
      var mess = msg.content.replace("tw " , '');
        GetChannelFollowers(mess,msg);
    }
  });   

  client.on('message', msg => {
    if (msg.content.startsWith('imp ')) {
      var mess = msg.content.replace("imp " , '');

      let user = msg.mentions.users.first();
      if(!user) user = msg.author;

      var arr = mess.split(' ');
      arr.shift();
      var aut = msg.author.id;
      aut = aut.slice('<').slice('>').slice('!').slice('@');

      let nickname = msg.guild.member(user.id).displayName;
        
      let message = arr.join(' ');
      CreateWebhook(msg,nickname,user.avatarURL(),message);
      msg.delete();
    }
  }); 


client.login('NTYyNzEwMzUzNTA3Nzc4NTYw.Xe5INQ.NRjx7nACyxCUMGmrHQ2YqNZz8GY');

function GetChannelFollowers(name,message) {
    var id = "000000";
    let follow;
    let logo;
    let partner;
    let status;
    let lang;
    
    fetch('https://api.twitch.tv/kraken/users?login=' + name, {
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': client_id
    }
    })
  .then((response) => response.json())
  .then((chan) => {
    if (chan._total <= 0) {
      message.reply('Channel not found!');
      return;
    }
    id = chan.users[0]._id;
    name = chan.users[0].display_name;
    logo = chan.users[0].logo; 
    
        //Foll Start
        fetch('https://api.twitch.tv/kraken/channels/'+ id , {
        headers: {
          'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-ID': client_id
          }
          })
        .then((response) => response.json())
        .then((fol) => {
            follow =  numberWithCommas(fol.followers);
            partner = fol.partner;
            lang = iso.getName(fol.language);
            
          fetch('https://api.twitch.tv/kraken/streams/' + id, {
            headers: {
              'Accept': 'application/vnd.twitchtv.v5+json',
              'Client-ID': client_id
            }
            })
            .then((response) => response.json())
            .then((stat) => {
              if(stat.stream != null)
              {
                status = ':red_circle: Live';
              } else {
                status = ':x: Offline';
              }
              if (lang == '') {
                lang = 'Not Specified';
              }
               SendMessage(message,logo,follow,status,name,partner,lang);
            });
        }); 
        //Foll End   
  });

           
}


function SendMessage(message,logo, follow,status,name,partner,lang)
{
    const Embed = new Discord.MessageEmbed()
        .setColor(getRandomColor())
        .setTitle(name)
        .setURL('https://twitch.tv/' + name)
        .setAuthor('', logo, '')
        .setDescription(name + ' Twitch channel statistics')
        .setThumbnail(logo)
        .addFields(
            { name: 'Followers', value: follow, inline: true },
            { name: 'Currently', value: status, inline: true },
        )
        .addFields(
            { name: 'Partner', value: partner, inline: true},
            { name: 'Language', value: lang, inline: true },
        )
        .setTimestamp()
        .setFooter('by KSBot', '');
        
         message.reply(Embed);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }



  async function CreateWebhook(msg,name,img,message)
  {
    img = img.replace('webp','png');
    img = img + '?size=128';
    
    msg.channel.createWebhook(name,
    {
      avatar: img,
    })
  .then(webhook => webhook.edit(name, img)
    .then(wb => wb.send(message))
    .then( () => webhook.delete()))
  
  }
