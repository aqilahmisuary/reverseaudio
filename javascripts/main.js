window.onload = function() {

var contextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);

if (contextClass) {
  var context = new contextClass();
} else {
  onError;
};

var request = new XMLHttpRequest();
request.open('GET', "https://dl.dropboxusercontent.com/u/30075450/Always%20In%20My%20Head%20-%20Coldplay.mp3", true);
request.responseType = 'arraybuffer';
request.onload = function() {
context.decodeAudioData(request.response, function(arrayBuffer) {
    buffer = arrayBuffer;
    console.log("Decoded!");
    document.getElementById("loadingbar").style.display = "none";
  }, onError);
 };
request.send();

function onError() { console.log("Bad browser! No Web Audio API for you"); }

var source = null;
var myAudioBuffer = null;
var analyser = context.createAnalyser();
var canvas = document.getElementById('myCanvas');
var myCanvas = canvas.getContext("2d");
var WIDTH = 1000;
var HEIGHT = 300;

var playButton = document.getElementById("startBtn");
var stopButton = document.getElementById("stopBtn");

analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

analyser.getByteTimeDomainData(dataArray); 
myCanvas.clearRect(0, 0, WIDTH, HEIGHT);

canvas.width = 1000;

function draw() {

  drawVisual = requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);
  
  myCanvas.fillStyle = '255,255,255, 0.1';
  myCanvas.fillRect(0, 0, WIDTH, HEIGHT);
  myCanvas.lineWidth = 2;
  myCanvas.strokeStyle = 'rgb(255,255,255)';
  myCanvas.beginPath();
  
  var sliceWidth = WIDTH * 1.0 / bufferLength;
  var x = 0;
  
  for(var i = 0; i < bufferLength; i++) {
   
        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
          myCanvas.moveTo(x, y);
        } else {
          myCanvas.lineTo(x, y);
        }

        x += sliceWidth;
      };
  
    myCanvas.lineTo(canvas.width, canvas.height/2);
    myCanvas.stroke();
    };


playButton.addEventListener("mousedown", function() {
  
  var source = context.createBufferSource();
  var now = context.currentTime;
  var mixGain = context.createGain();
    
  source.buffer = buffer;
  var soundDuration = source.buffer.duration;
  Array.prototype.reverse.call(buffer.getChannelData(0));
  Array.prototype.reverse.call(buffer.getChannelData(1));
  
  source.connect(analyser);
  analyser.connect(context.destination);
  
  source.start(now);
  draw();
    
  stopButton.addEventListener("mousedown", function() {
  
  mixGain.gain.linearRampToValueAtTime(0, now + 0.2);
  source.stop(now + 0.2);
  
 }, false);
  
 }, false);



};