import $ from 'jquery';
const d3 = require('d3');

export default function netviz() {
    var mainDiv = document.getElementById('mainContainer');
    var svgNetViz = d3.select(mainDiv).append('svg');
    console.log('test')
}