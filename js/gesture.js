gestureON = true; //IF YOU PRESS SPACEBAR YOU CAN ACTIVATE/DEACTIVATE THE WEBCAM MODE

window.onkeypress = function(e) {
  if (e.keyCode == 0) //0 == spacebar
  {
    gestureON = gestureON? false: true;
    if (gestureON)
    {
       document.getElementById('mini').style.display = 'block';
       document.getElementById('disp').style.display = 'block';
    }
    else
    {
       document.getElementById('mini').style.display = 'none';
       document.getElementById('disp').style.display = 'none';
    }
  }
};

//Mozilla Gestures - up down left right --- compatible with REVEAL.JS - inspired by gesture.js and webcam-swiper0.1.js
test = document.getElementById("comp")
test = test.getContext('2d');
video = document.getElementById('video')
video.addEventListener('play',function(){setInterval(dump,1000/20)});
canvas=document.getElementById('canvas');
x1=canvas.getContext('2d');

//Firefox needs prefix "moz" to work...
navigator.mozGetUserMedia({audio:true,video:true},function(stream){ //okFallbackfunction
      video.src=window.URL.createObjectURL(stream)
      video.play();
    },function(){ //errorFallbackFunction
	  console.log('OOOOOOOH! DEEEEENIED!')
});

huemin=0.0
huemax=0.10
satmin=0.0
satmax=1.0
valmin=0.4
valmax=1.0

lastX0=0;
lastY0=9999;
lastX=0;
lastY=9999;
lastX1=0;
lastY1=9999;
lastX2=0;
lastY2=9999;

oldTime = new Date().getTime();
thirdTime = new Date().getTime();
state=0//States: 0 waiting for gesture, 1 waiting for next move after gesture, 2 waiting for gesture to end

function dump()
{ //draw method
  if (gestureON)
  {
      compression = 2.3;
      thisTime = new Date().getTime(); //miliseconds
      if (video.videoWidth == 0 )return;
      w=Math.floor(video.videoWidth/compression)
      h=Math.floor(video.videoHeight/compression-0.3);

      x1.drawImage(video,0,0,video.videoWidth,video.videoHeight)

      var pixels = x1.getImageData(0, 0, w, h);
      var pixLength = pixels.data.length / 4;
      ////////
      //map: make two dimensional array to store which pixels detect green
      //scores: 2d array to store the 5x5 scores for each pixel. Each pixel
      // gets a score of the summary of the green pixels around it. It looks
      // at the 5 pixels to the left, right, above and below the pixel. The
      // pixel gets the score of the sum of that total.
      var map = new Array(w);
      var scores = new Array(w);
      for(var i = 0; i < w; i++){
            map[i] = new Array(h);
      }
      //load the map with 1 and 0 for green and non-green pixels respectively
      for(var i = 0; i < pixLength; i++)
      {
          var index = i*4;
          var r = pixels.data[index],
              g = pixels.data[index+1],
              b = pixels.data[index+2];
          var hsl = RGBToHSL(r, g, b),
              ha = hsl[0],
              s = hsl[1],
              l = hsl[2];

          var left = Math.floor(i%w);
          var top = Math.floor(i/w);

          //      if (ha >= 70 && ha <= 180 &&
          //          s >= 25 && s <= 90 &&
          //          l >= 20 && l <= 95)
          //          {

          //skin in rgb values: R:239, G:208, B:207
          if ((r > 200 && r < 245)&&
          (g > 175 && g < 215) &&
          (b > 175 && b < 215)) { //skin test with some margin (use your webcam with low color and high gamma/brightness to improve performance)
          //if (((hsl[0] > huemin && hsl[0] < huemax)||(hsl[0] > 0.59 && hsl[0] < 1.0))&&(hsl[1] > satmin && hsl[1] < satmax)&&(hsl[2] > valmin && hsl[2] < valmax)){
          pixels.data[i * 4 + 3] = 0; //turn pixel in black dot
          map[left][top] = 1;
          }
          else
          {
              map[left][top] = 0;
          }
      }
      //get pixel most to the north and most to the left
      npixel = 9999 //north 9999 = south
      rpixel = 9999 //right = 9999

      for(var j = 1; j < h-1; j++){ //j=y
          for(var i = 1; i < w-1; i++){ //i=x
                  if (map[i][j] && (i < rpixel)) rpixel = i;
                  if (map[i][j] && (j < npixel)) npixel = j;
          }
      }

      margin_value = 65; //only detect great changes
      marginY = margin_value;
      marginX = margin_value;
      goY = '';
      goX = '';

      if ((state == 1) && (thisTime - thirdTime > 1500)) // timeout
      {
        console.log("Timeout!")
        //reset ALL
        state = 0;
        oldTime = new Date().getTime();
        lastX=0;
        lastY=9999;
        lastX1=0;
        lastY1=9999;
      }

      if (npixel > 0 && rpixel > 0)
      {

        //DEBUG WHERE ARE THE RPIXEL,NPIXEL with 5 pixels wide line
        zpixel = rpixel+(npixel*w);
        pixels.data[((zpixel+0) * 4) + 1] = 255;
        pixels.data[((zpixel+0) * 4) + 2] = 0;
        pixels.data[((zpixel+0) * 4) + 3] = 0;
        pixels.data[((zpixel+1) * 4) + 1] = 255;
        pixels.data[((zpixel+1) * 4) + 2] = 0;
        pixels.data[((zpixel+1) * 4) + 3] = 0;
        pixels.data[((zpixel+2) * 4) + 1] = 255;
        pixels.data[((zpixel+2) * 4) + 2] = 0;
        pixels.data[((zpixel+2) * 4) + 3] = 0;
        pixels.data[((zpixel+3) * 4) + 1] = 255;
        pixels.data[((zpixel+3) * 4) + 2] = 0;
        pixels.data[((zpixel+3) * 4) + 3] = 0;
        pixels.data[((zpixel+4) * 4) + 1] = 255;
        pixels.data[((zpixel+4) * 4) + 2] = 0;
        pixels.data[((zpixel+4) * 4) + 3] = 0;
        pixels.data[((zpixel+5) * 4) + 1] = 255;
        pixels.data[((zpixel+5) * 4) + 2] = 0;
        pixels.data[((zpixel+5) * 4) + 3] = 0;

        mudou = 0; //mudou == "changed" in english...

        switch(state)
        {
           case 0: //get Position-Zero
                if ((npixel > lastY + marginY) || (npixel < lastY - marginY))
                {
                   lastY = npixel;
                   mudou += 1;

                }
                if ((rpixel > lastX + marginX) || (rpixel < lastX - marginX))
                {
                   lastX = rpixel;
                   mudou += 2;
                }
                if (mudou) oldTime = new Date().getTime(); //restart clock
                else if ((!mudou) && (thisTime - oldTime > 1000) && (lastX > 0 && lastY < 9999  ))
                {  //user must rest 1.5 second in the same position to calibrate
                   //get Position ONE
                   state++;
                   lastX1 = lastX;
                   lastY1 = lastY;

                   lastX0 = lastX1;
                   lastY0 = lastY1;

                   lastX2 = 0;
                   lastY2 = 9999;

                   thirdTime = new Date().getTime();
                   oldTime = new Date().getTime(); //restart clock
                }
                break;
           case 1:
                if ((npixel > lastY1 + (marginY*1)) || (npixel < lastY1 - (marginY*1)))
                {
                   if (lastY1 < npixel) goY = 'down';
                   else goY = 'up';
                   mudou += 1;
                }
                if ((rpixel > lastX1 + (marginX*1)) || (rpixel < lastX1 - (marginX*1)))
                {
                   //if (lastX < rpixel) goX = 'right';
                   //else goX = 'left';
                   //It is mirrored, so inverse
                   if (lastX1 < rpixel) goX = 'left';
                   else goX = 'right';
                   mudou += 2;
                }
                if ((mudou) && (thisTime - oldTime > 50))
                //        if ((mudou) )// && ((thisTime - oldTime > 500)))
                {
                     //bigger delta determines the type of movement
                     //if (mudou >= 2)
                     if (Math.abs(lastX1 - rpixel) >= Math.abs(lastY1 - npixel))
                     {
                       if (goX == 'right') Reveal.navigateRight()
                       else Reveal.navigateLeft()
                       console.log(goX)
                     }
                     else
                     {
                       if (goY == 'up') Reveal.navigateUp()
                       else Reveal.navigateDown()
                       console.log(goY)
                     }


                     state=0;
                     console.log('deltaX='+Math.abs(lastX1 - rpixel) +' --- deltaY='+Math.abs(lastY1 - npixel))
                     //             console.log("lastXY("+lastX+","+lastY+") pixelXY("+rpixel+","+npixel+") delta="+(thisTime - oldTime))

                     lastY2 = npixel;
                     lastX2 = rpixel;
                     //reset values
                     oldTime = new Date().getTime();
                     lastX=0;
                     lastY=9999;
                     lastX1=0;
                     lastY1=9999;
                }
                break;
           case 2: //Get Position TWO (TWO-ONE = GESTURE)
                break;
        } //switch
      }

      for(z = lastY0-3;z < lastY0+3;z++)
      {
        zpixel = lastX0+(z*w);
        if (z == lastY0)
        {
          pixels.data[((zpixel-3) * 4) + 1] = 0;
          pixels.data[((zpixel-3) * 4) + 2] = 0;
          pixels.data[((zpixel-3) * 4) + 3] = 255;
          pixels.data[((zpixel-2) * 4) + 1] = 0;
          pixels.data[((zpixel-2) * 4) + 2] = 0;
          pixels.data[((zpixel-2) * 4) + 3] = 255;
          pixels.data[((zpixel-1) * 4) + 1] = 0;
          pixels.data[((zpixel-1) * 4) + 2] = 0;
          pixels.data[((zpixel-1) * 4) + 3] = 255;
        }
        pixels.data[((zpixel+0) * 4) + 1] = 0;
        pixels.data[((zpixel+0) * 4) + 2] = 0;
        pixels.data[((zpixel+0) * 4) + 3] = 255;
        if (z == lastY0)
        {
          pixels.data[((zpixel+1) * 4) + 1] = 0;
          pixels.data[((zpixel+1) * 4) + 2] = 0;
          pixels.data[((zpixel+1) * 4) + 3] = 255;
          pixels.data[((zpixel+2) * 4) + 1] = 0;
          pixels.data[((zpixel+2) * 4) + 2] = 0;
          pixels.data[((zpixel+2) * 4) + 3] = 255;
          pixels.data[((zpixel+3) * 4) + 1] = 0;
          pixels.data[((zpixel+3) * 4) + 2] = 0;
          pixels.data[((zpixel+3) * 4) + 3] = 255;
        }
      }

      for(z2 = lastY2-3;z2 < lastY2+3;z2++)
      {
        zpixel = lastX2+(z2*w);
        if (z2 == lastY2)
        {
          pixels.data[((zpixel-3) * 4) + 1] = 0;
          pixels.data[((zpixel-3) * 4) + 2] = 0;
          pixels.data[((zpixel-3) * 4) + 3] = 0;
          pixels.data[((zpixel-2) * 4) + 1] = 0;
          pixels.data[((zpixel-2) * 4) + 2] = 0;
          pixels.data[((zpixel-2) * 4) + 3] = 0;
          pixels.data[((zpixel-1) * 4) + 1] = 0;
          pixels.data[((zpixel-1) * 4) + 2] = 0;
          pixels.data[((zpixel-1) * 4) + 3] = 0;
        }
        pixels.data[((zpixel+0) * 4) + 1] = 0;
        pixels.data[((zpixel+0) * 4) + 2] = 0;
        pixels.data[((zpixel+0) * 4) + 3] = 0;
        if (z2 == lastY2)
        {
          pixels.data[((zpixel+1) * 4) + 1] = 0;
          pixels.data[((zpixel+1) * 4) + 2] = 0;
          pixels.data[((zpixel+1) * 4) + 3] = 0;
          pixels.data[((zpixel+2) * 4) + 1] = 0;
          pixels.data[((zpixel+2) * 4) + 2] = 0;
          pixels.data[((zpixel+2) * 4) + 3] = 0;
          pixels.data[((zpixel+3) * 4) + 1] = 0;
          pixels.data[((zpixel+3) * 4) + 2] = 0;
          pixels.data[((zpixel+3) * 4) + 3] = 0;
        }
      }

      if (state == 1) //warn user that it awaits gesture and calibration has finished
      {
        document.getElementById('mini').style.display = 'block';
      }
      else
      {
        document.getElementById('mini').style.display = 'none';
      }

      //arrow(test,{x:lastX1,y:lastY1},{x:lastX2,y:lastY2},10); //couldnt make it work...
      //  x1.putImageData(pixels, 0, 0);
      test.putImageData(pixels, 0, 0);
  }//gestureON
}//dump()

function RGBToHSL(r, g, b)
{
   var min = Math.min(r, g, b), max = Math.max(r, g, b), diff = max - min, h = 0, s = 0, l = (min + max) / 2;

   if (diff != 0) {
    s = l < 0.5 ? diff / (max + min) : diff / (2 - max - min);
    h = (r == max ? (g - b) / diff : g == max ? 2 + (b - r) / diff : 4 + (r - g) / diff) * 60;
   }

   return [h, s, l];
}

function HSLToRGB(h, s, l) {
if (s == 0) {
return [l, l, l];
}

var temp2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
var temp1 = 2 * l - temp2;

h /= 360;

var
rtemp = (h + 1 / 3) % 1,
gtemp = h,
btemp = (h + 2 / 3) % 1,
rgb = [rtemp, gtemp, btemp],
i = 0;

for (; i < 3; ++i) {
rgb[i] = rgb[i] < 1 / 6 ? temp1 + (temp2 - temp1) * 6 * rgb[i] : rgb[i] < 1 / 2 ? temp2 : rgb[i] < 2 / 3 ? temp1 + (temp2 - temp1) * 6 * (2 / 3 - rgb[i]) : temp1;
}

return rgb;
}

///////////////////////////////////////////// http://stackoverflow.com/a/8217323
//couldnt make it work for now...
function arrow(ctx,p1,p2,size){
      ctx.lineWidth = 2;
      ctx.fillStyle = ctx.strokeStyle = '#099';

      ctx.save();

      var points = edges(ctx,p1,p2);
      if (points.length < 2) return
      p1 = points[0], p2=points[points.length-1];

      // Rotate the context to point along the path
      var dx = p2.x-p1.x, dy=p2.y-p1.y, len=Math.sqrt(dx*dx+dy*dy);
      ctx.translate(p2.x,p2.y);
      ctx.rotate(Math.atan2(dy,dx));

      // line
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(-len,0);
      ctx.closePath();
      ctx.stroke();

      // arrowhead
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(-size,-size);
      ctx.lineTo(-size, size);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
}
// Find all transparent/opaque transitions between two points
// Uses http://en.wikipedia.org/wiki/Bresenham's_line_algorithm
function edges(ctx,p1,p2,cutoff){
  if (!cutoff) cutoff = 220; // alpha threshold
  var dx = Math.abs(p2.x - p1.x), dy = Math.abs(p2.y - p1.y),
      sx = p2.x > p1.x ? 1 : -1,  sy = p2.y > p1.y ? 1 : -1;
  var x0 = Math.min(p1.x,p2.x), y0=Math.min(p1.y,p2.y);
  var pixels = ctx.getImageData(x0,y0,dx+1,dy+1).data;
  var hits=[], over=null;
  for (x=p1.x,y=p1.y,e=dx-dy; x!=p2.x||y!=p2.y;){
    var alpha = pixels[((y-y0)*(dx+1)+x-x0)*4 + 3];
    if (over!=null && (over ? alpha<cutoff : alpha>=cutoff)){
      hits.push({x:x,y:y});
    }
    var e2 = 2*e;
    if (e2 > -dy){ e-=dy; x+=sx }
    if (e2 <  dx){ e+=dx; y+=sy  }
    over = alpha>=cutoff;
  }
  return hits;
}
