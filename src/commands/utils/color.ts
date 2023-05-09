import {Message} from 'discord.js';
import { prefix } from '../../lib/aliceClient';
import { createCanvas, loadImage } from 'canvas'
import { cleanEveryone, cleanHere } from "../../lib/sanitize";
import * as fs from 'fs';
import tinycolor from 'tinycolor2';
import bent from 'bent';

module.exports = {
  name: 'color',
  description: 'See a color from its hex.',
  usage: `color #000000`,
  aliases: ['clr', 'colour'],
  argsRequired: true,
  async run(message: Message, args: string[]) {
    // Declare constants
    const canvas = createCanvas(600, 400)
    const canvasContext = canvas.getContext('2d')
    const getJSON = bent('json')

    // Grab color, color name, and complementary color
    let color: string = args[0]
    let colorComp: string = tinycolor(color).complement().toHexString();
    let rawName = await getJSON(`https://colornames.org/search/json/?hex=${color.replace(/#/i, '')}`)
    canvasContext.fillStyle = args[0]
    
    // Completely fill canvas with user's color
    canvasContext.fillRect(0, 0, 600, 400);

    // set the fillStyle for text to be user's color's complementary color
    canvasContext.fillStyle = colorComp;
    canvasContext.textBaseline = "middle";
    
    // Write hex value
    canvasContext.textAlign="left"; 
    canvasContext.font = "56px Iosevka Term"
    canvasContext.fillText(color, 20, 330)
    canvasContext.strokeText(color, 20, 330)

    // Write color name
    canvasContext.font = "36px Iosevka Term"
    canvasContext.fillText(rawName.name, 20, 375)    
    canvasContext.strokeText(rawName.name, 20, 375)    

    // Write canvas to image file
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync('./color.png', buffer)

    // Upload resulting image
    message.reply({files: ['./color.png'] });
  },
};
