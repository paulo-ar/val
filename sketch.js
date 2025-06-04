let font;
let points = [];
let current = [];
let maxStars = 0;

let planets = [];

function preload() {
  // Fuente similar a MonteCarlo
   font = loadFont('MonteCarlo-Regular.ttf');
}

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES);
  background(0);

  // Obtener puntos del texto (solo primera letra en mayúscula)
  let textPoints = font.textToPoints('Valentina', 0, 0, 100, {
    sampleFactor: 0.25,
    simplifyThreshold: 0
  });

  // Centrar texto
  let bounds = font.textBounds('Valentina', 0, 0, 100);
  let offsetX = (width - bounds.w) / 2 - bounds.x;
  let offsetY = (height - bounds.h) / 2 - bounds.y;

  for (let pt of textPoints) {
    pt.x += offsetX;
    pt.y += offsetY;
  }

  points = shuffle(textPoints);
  maxStars = points.length;

  // Planetas con órbitas grandes para fondo (ahora más pequeños)
  let maxOrbit = min(width, height) * 0.95;
  for (let i = 0; i < 4; i++) {
    planets.push({
      radius: 10 + i * 5, // planetas más pequeños
      orbitRadius: map(i, 0, 3, 100, maxOrbit / 2),
      angle: random(360),
      speed: 0.1 + i * 0.03
    });
  }
}

function draw() {
  background(0);

  drawSolarSystem();

  // Dibujar estrellas que forman el texto
  fill(255);
  noStroke();

  if (current.length < maxStars) {
    current.push(points[current.length]);
  }

  for (let pt of current) {
    let jitterX = random(-0.5, 0.5);
    let jitterY = random(-0.5, 0.5);
    ellipse(pt.x + jitterX, pt.y + jitterY, 2, 2);
  }
}

function drawSolarSystem() {
  push();
  translate(width / 2, height / 2);

  // Sol (sutil)
  noFill();
  stroke(255, 50);
  ellipse(0, 0, 50, 50);

  // Órbitas translúcidas
  stroke(255, 20);
  for (let p of planets) {
    ellipse(0, 0, p.orbitRadius * 2, p.orbitRadius); // achatamiento para isométrica
  }

  // Planetas
  for (let p of planets) {
    let x = cos(p.angle) * p.orbitRadius;
    let y = sin(p.angle) * p.orbitRadius * 0.5;

    push();
    translate(x, y);
    drawWavyPlanet(p.radius);
    pop();

    p.angle += p.speed;
  }

  pop();
}

function drawWavyPlanet(r) {
  noStroke();
  fill(255, 30); // relleno translúcido
  ellipse(0, 0, r * 2, r * 2);

  // Ondas circulares internas (menos cantidad para mantener forma circular)
  stroke(255, 40);
  noFill();
  for (let i = 0; i < 3; i++) { // reducida de 6 a 3 ondas
    beginShape();
    for (let a = 0; a <= 360; a += 15) { // menos puntos para más suavidad
      let offset = sin(a * 2 + i * 60) * 1.5;
      let rad = r - i * 4 + offset;
      let x = cos(a) * rad;
      let y = sin(a) * rad;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}
