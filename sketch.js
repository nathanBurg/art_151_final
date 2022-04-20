let facemesh;
let video;
let predictions = [];
let frameCt = 0;
let mouthPointY;
let bottomLip;
let bottomLipY;
let fillColor;
let ang = 0;
let open = false;


function setup() {
  var cnv = createCanvas(640, 480);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  background(255, 0, 200);
  
  video = createCapture(VIDEO);
  video.size(width, height);
  

  facemesh = ml5.facemesh(video, modelReady);

  facemesh.on("predict", (results) => {
    predictions = results;
  });

  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  image(video, 0, 0, width, height);
  filter(POSTERIZE, 10);
  drawKeypoints(video, frameCt);
  
  if (open) {
    let x = map(cos(ang), -1, 1, 20, width - 20);
    let y = map(sin(ang), -1, 1, 20, height - 20);
    let xR = map(cos(ang), -1, 1, 500, 400);
    let yR = map(sin(ang), -1, 1, 400, 300);
    let xI = map(cos(ang), -1, 1, 100, 300);
    let yI = map(sin(ang), -1, 1, 150, 250);
    let x2 = map(cos(ang), -1, 1, 20, 100);
    let y2 = map(sin(ang), -1, 1, 20, 200);
   
    strokeWeight(5);
    for (let i = 0; i < 200; i++) {
      stroke(random(255), 255, random(255)); 
      point(x, random(600));
      point(random(800), y);
    }
    for (let i = 0; i < 200; i++) {
      stroke(random(255), random(255), 255); 
      point(x2, random(600));
      point(random(800), y2);
    }
    for (let i = 0; i < 200; i++) {
      stroke(255, random(255), random(255)); 
      point(xI, random(600));
      point(random(800), yI);
    }
    for (let i = 0; i < 200; i++) {
      stroke(255); 
      point(xR, random(600));
      point(random(800), yR);
    }
  }

  frameCt += 1;
  ang += 0.03;
}

function randomObj(x, y, diam, fillColor) {
  fill(fillColor);
  noStroke();
  beginShape();
  vertex(x + random(diam), y + random(diam));
  vertex(x - random(diam), y - random(diam));
  vertex(x + random(diam), y + random(diam));
  vertex(x - random(diam), y - random(diam));
  vertex(x, y);
  vertex(x + random(diam), y + random(diam));
  vertex(x - random(diam), y - random(diam));
  vertex(x, y);
  endShape(CLOSE);
}



function drawKeypoints(image, frameCt) {
  fillColor = (random(255), random(255), 100);
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;
    

    // Draw facial keypoints.
    for (let j = 0; j < keypoints.length; j += 1) {
      if (j == 61) {
        mouthPointY = keypoints[j][1];
      } else if (j == 14) {
        bottomLip = keypoints[j];
        bottomLipY = bottomLip[1];
      }
      const [x, y] = keypoints[j];

      

      fillColor = color(random(180), random(100), 100);

      if (bottomLipY > mouthPointY) {
        const r = 255 - red(fillColor);
        const g = 255 - green(fillColor);
        const b = 255 - blue(fillColor);
        let outputColor = color(r, g, b);
        randomObj(x+60, y+60, 5, outputColor);
        randomObj(x+60, y-60, 5, outputColor);
        randomObj(x-60, y+60, 5, outputColor);
        randomObj(x-60, y-60, 5, outputColor);
        
        open = true; 
        
      } else {
        randomObj(x, y, 15, fillColor);
        open = false;
      }
    }
  }
}

