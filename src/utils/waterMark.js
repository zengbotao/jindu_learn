// 水印
const textBecomeImg = (text,fontsize,fontcolor) => {
    let canvas = document.createElement('canvas');
    let buHeight = 0;

    if(fontsize <= 32){ buHeight = 99; }
    else if(fontsize > 32 && fontsize <= 60 ){ buHeight = 2;}
    else if(fontsize > 60 && fontsize <= 80 ){ buHeight = 4;}
    else if(fontsize > 80 && fontsize <= 100 ){ buHeight = 6;}
    else if(fontsize > 100 ){ buHeight = 10;}

    canvas.height=fontsize + buHeight ;
    canvas.padding=30;

    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width*2, canvas.height);
    context.textAlign = "center";
    canvas.width = 450;
    canvas.height = 200;
    context.fillStyle = fontcolor;
    context.font=fontsize+"px Arial";
    context.textBaseline = 'middle'; 
    context.fillText(text, 0, fontsize/2);

    let dataUrl = canvas.toDataURL('image/png');

    return dataUrl;
}

const deleWater = () => {
    let childNode = document.getElementById('waterMark')
    if(childNode) {
      document.body.removeChild(childNode)
    }
}
const  waterMark = (msg, none) => {
    let text = localStorage.getItem('waterMark') ? localStorage.getItem('waterMark') : msg;
    let shuiyinDiv = document.createElement('div');
    let style = shuiyinDiv.style;
    shuiyinDiv.id = "waterMark";
    style.position = 'absolute';
    style.left = 0;
    style.top = '-60%';
    style.width = '120%';
    style.height = '200%';
    style.opacity = '0.3';
    style.background = "url(" + textBecomeImg(text, 22, "#d0d0d0")+")";
    style.zIndex = 9999999991;
    style.transform = "rotate(-30deg)";
    style.pointerEvents = "none";
    // 清除掉之前的标签
    if (none) {
        deleWater()
        localStorage.removeItem('waterMark')
    } else {
        if (document.getElementById('waterMark')) deleWater()
        localStorage.setItem('waterMark', text)
        document.body.appendChild(shuiyinDiv);
    }
}

export default waterMark