const fs = require('fs');
const Color = require('color');
const testColors = require('./colors.json');

const template = fs.readFileSync('./src/template.html', 'utf8');

type Rgb = [number, number, number];

function getSquare(color: Rgb, isLong?: boolean): string {
    return `<div class="color" style="width: ${isLong ? 200 : 100}px; background: rgb(${color})"></div>`;
}

function getSimpleAverageColor(color1: Rgb, color2: Rgb): Rgb {
    function getItem(num: number): number {
        return Math.round((color1[num] + color2[num]) / 2);
    }

    return [
        getItem(0),
        getItem(1),
        getItem(2)
    ];
}

function getSqrtAverageColor(color1: Rgb, color2: Rgb): Rgb {
    function getItem(num: number): number {
        return Math.round(Math.sqrt((color1[num] * color1[num] + color2[num] * color2[num]) / 2));
    }

    return [
        getItem(0),
        getItem(1),
        getItem(2)
    ];
}

function getLabAverageColor(lab1: Rgb, lab2: Rgb): Rgb {
    function getItem(num: number): number {
        return (lab1[num] + lab2[num]) / 2;
    }

    const rgb: Rgb = Color.lab(
        getItem(0),
        getItem(1),
        getItem(2)
    ).rgb().array();

    return [
        Math.round(rgb[0]),
        Math.round(rgb[1]),
        Math.round(rgb[2])
    ];
}

function printColor(rgb: Rgb, lab?: Rgb): string {
    let text: string = '';

    text += 'rgb: ' + rgb + '<br/>';
    if (lab) {
        text += 'lab: ' + lab.map(item => item.toFixed(1));
    }

    return text;
}

const content: string = testColors.map(function(item: [string, string], i: number): string {
    const color1: any = Color(item[0]);
    const color2: any = Color(item[1]);
    const rgb1: Rgb = color1.rgb().array();
    const rgb2: Rgb = color2.rgb().array();
    const lab1: Rgb = color1.lab().array();
    const lab2: Rgb = color2.lab().array();
    const simpleAverage: Rgb = getSimpleAverageColor(rgb1, rgb2);
    const sqrtAverage: Rgb = getSqrtAverageColor(rgb1, rgb2);
    const labAverage: Rgb = getLabAverageColor(lab1, lab2);
    return `\n<tr><td class="num">${i + 1}.</td>
    <td>${getSquare(rgb1, true)}${printColor(rgb1, lab1)}</td>
    <td>${getSquare(simpleAverage)}${printColor(simpleAverage)}</td>
    <td>${getSquare(sqrtAverage)}${printColor(sqrtAverage)}</td>
    <td>${getSquare(labAverage)}${printColor(labAverage)}</td>
    <td>${getSquare(rgb2, true)}${printColor(rgb2, lab2)}</td>
    </tr>`;
}).join('');

fs.writeFileSync('index.html', template.replace(/\{\{content\}\}/, content));
