      var tabsrc=[];
      var arrToColor=[];
      var tabData=[];
      function initColorize(){
            var tabimg=document.getElementsByTagName("img");
            for(i=0;i<tabimg.length;i++){
                  if(tabimg[i].classList.contains("colorize")){
                      arrToColor.push(tabimg[i]);
                  }
            }
            for(i=0;i<arrToColor.length;i++){
                  arrToColor[i].setAttribute('imgid',i);
                  arrToColor[i].setAttribute("onmouseover","colorize(this);");
                  arrToColor[i].setAttribute("onmouseout","backToImage(this);");
                  tabsrc.push({'imgid':i,'src':arrToColor[i].getAttribute("src")});
            }
      }

      function backToImage(img){
            for(i=0;i<arrToColor.length;i++){
                  if(tabsrc[i].imgid==img.getAttribute('imgid')){
                        img.setAttribute("src",tabsrc[i].src);
                        return 0;
                  }
            }
      }
          
      function colorize(imgElement) {
      if(tabData[imgElement.getAttribute("imgid")]){
            imgElement.src = tabData[imgElement.getAttribute("imgid")];
            return 0;
      }
      var rgb = {r:0,g:0,b:0};
      
      // create hidden canvas (using image dimensions)
      var canvas = document.createElement("canvas");
      canvas.width = imgElement.clientWidth;
      canvas.height = imgElement.clientHeight;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(imgElement,0,0,canvas.width,canvas.height);
            
      //Get pixels color and count occurences
      var map = ctx.getImageData(0,0,canvas.width,canvas.height);
      var imdata = map.data;
      var length = imdata.length;
      var occur = {};
      for(i=0;i < length;i+=4*20) {  
            rgb.r = imdata[i];
            rgb.g = imdata[i+1];
            rgb.b = imdata[i+2];
            //If not too white
            if(!(rgb.r > 240 && rgb.g > 240 && rgb.b > 240)){
                  color=(toHexRGB(rgb.r,rgb.g,rgb.b));
                  if(!occur[color]){
                        occur[color] = 0;
                  }
                        ++occur[color];
            }
      }
      //Get the most seen color
      var max=0;
      for (key in occur){
            if(occur[key]>max){
                  max=occur[key];
                  color=key;
            }
      }
      //Fill the canvas with said color
      ctx.putImageData(map,0,0);
      ctx.globalAlpha=0.8;
      ctx.fillStyle=color;
      ctx.fillRect(0,0,canvas.width,canvas.height);
            
      //Set the text color to black or white
      ctx.fillStyle = getTextColor(color);
      ctx.font = "bold 16px Arial";
      ctx.textAlign = 'center';
      text=imgElement.getAttribute("colorizeText");
      text=text==null?'':text;
      ctx.fillText(text, canvas.width/2, canvas.height/2);
      //Replace the image with the canvas content(base64)
      imgElement.src = canvas.toDataURL();
      tabData[imgElement.getAttribute("imgid")]=canvas.toDataURL();
}

function getTextColor(color){
            red=parseInt(color.substring(1,3),16);
            green=parseInt(color.substring(3,5),16);
            blue=parseInt(color.substring(5,7),16);
            return textColor=(red+blue+green) / 3 > 127 ? "#000000" : "#FFFFFF";
      }
function toHexRGB(r,g,b){
            r=r.toString(16);
            r=r.length==1? '0'+r:r;
            g=g.toString(16);
            g=g.length==1? '0'+g:g;
            b=b.toString(16);
            b=b.length==1? '0'+b:b;
            return "#"+r+g+b;
      }