import anime from 'animejs'

const scale = 1;
const numberOfParticle = 6;
// const particleColor = '#1d72ff';
const particleColor = ['#4fc3f7','#00b454','#d8f800','#0b61a4','#4db6ac','#f06292'];
const particleDistance = 100 * scale;
const circleSize = 90 * scale;
const circleBorderWidth = 10 * scale;
const particleSize = 10 * scale;
const circleOpacity = .5
const duration = 1000;

function createCircle(x, y, color = '#1d72ff') {
  const circle = document.createElement('span');
  circle.style.position = 'fixed';
  circle.style.display = 'block';
  circle.style.borderRadius = `${circleSize}px`;
  circle.style.boxSizing = 'border-box';
  circle.style.opacity = `${circleOpacity}`
  circle.style.width = circleSize + 'px';
  circle.style.height = circleSize + 'px';
  circle.style.left = x - circleSize / 2 + 'px';
  circle.style.top = y - circleSize / 2 + 'px';
  circle.style.border = `${circleBorderWidth}px solid ${color}`;
  circle.style.transform = 'scale(.01)';
  circle.classList.add('circle');

  circle.style.borderWidth = '10px';
  document.body.appendChild(circle);
  return circle;
}

function createParticle(x, y, index) {
  x = x - particleSize / 2;
  y = y - particleSize / 2;
  const particle = document.createElement('div');
  particle.style.position = 'fixed';
  particle.classList.add('particle');
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  particle.style.width = particleSize + 'px';
  particle.style.height = particleSize + 'px';
  particle.style.borderRadius = particleSize + 'px';
  if (particleColor instanceof Array) {
    particle.style.backgroundColor = particleColor[index % particleColor.length]
  } else {
    particle.style.backgroundColor = particleColor;
  }
  particle.radius = particleDistance;

  const angle = (index * (360 / numberOfParticle) - 90) * Math.PI / 180;
  particle.endPos = {
    x: Math.cos(angle) * particle.radius,
    y: Math.sin(angle) * particle.radius
  };

  document.body.appendChild(particle);
  return particle;
}

export function fire(x, y) {
  const particles = [];
  for (let i = 0; i < numberOfParticle; i++) {
    particles.push(createParticle(x, y, i));
  }
  const circle = createCircle(x, y);

  anime.timeline()
    .add({
      targets: particles,
      translateX: function (p) {
        return parseFloat(p.endPos.x.toFixed(10));
      },
      translateY: function (p) {
        return parseFloat(p.endPos.y.toFixed(10));
      },
      // scale: 0.01,
      easing: 'easeOutExpo',
      duration: duration
    })
    .add({
      translateX: function (p) {
        return parseFloat(p.endPos.x.toFixed(10));
      },
      translateY: function (p) {
        return parseFloat(p.endPos.y.toFixed(10));
      },
      targets: particles,
      scale: 0.01,
      easing: 'easeOutQuad',
      duration: 900,
      offset: duration - 900
    })
    .add({
      targets: circle,
      scale: 1,
      borderWidth: circleBorderWidth,
      easing: 'easeOutQuad',
      duration: duration / 3.5,
      offset: 0
    })
    .add({
      targets: circle,
      borderWidth: 0,
      easing: 'linear',
      duration: duration / 3.5,
      offset: duration / 3.5
    });
  setTimeout(function () {
    particles.forEach(o => {
      document.body.removeChild(o);
    });
    document.body.removeChild(circle)
  }, duration);
}


export function shake(e) {
  anime({
    targets:e,
    rotate:[
      {value:-30,duration:200,easing:'easeOutExpo'},
      {value:10,duration:200,easing:'easeOutExpo'},
      {value:0,duration:100,easing:'linear'},
    ],
    scale:[
      {value:1.2,duration:200,easing:'easeOutExpo'},
      {value:1,duration:100,easing:'linear'},
    ]
  })
}

/*
document.addEventListener(tap, function (e) {
  updateCoords(e);
  fire();
});
*/
