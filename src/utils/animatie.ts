import anime from 'animejs'

const scale = 1 // 动画的整体缩放
const numberOfParticle = 6 // 粒子数量
const particleColor = ['#4fc3f7', '#00b454', '#d8f800', '#0b61a4', '#4db6ac', '#f06292'] // 粒子颜色
const particleDistance = 100 * scale // 粒子飞行距离
const circleSize = 90 * scale  // 圆环大小
const circleBorderWidth = 10 * scale // 圆环宽度
const particleSize = 10 * scale // 粒子大小
const circleOpacity = .5 // 圆环透明度
const duration = 1000 // 动画持续时间

function createCircle(x, y, color = '#1d72ff') {
  const circle = document.createElement('span')
  circle.style.position = 'fixed'  // 使用fixed以防撑开页面
  circle.style.display = 'block'
  circle.style.borderRadius = `${circleSize}px`
  circle.style.boxSizing = 'border-box'
  circle.style.opacity = `${circleOpacity}`
  circle.style.width = circleSize + 'px'
  circle.style.height = circleSize + 'px'
  circle.style.left = x - circleSize / 2 + 'px'
  circle.style.top = y - circleSize / 2 + 'px'
  circle.style.border = `${circleBorderWidth}px solid ${color}`
  circle.style.transform = 'scale(.01)'
  circle.style.borderWidth = '10px'
  document.body.appendChild(circle)
  return circle
}

/*class Particle extends HTMLElement {
  public endPos!: {
    x: number, y: number,
  }
}*/

declare global {
  interface HTMLDivElement {
    endPos: {
      x: number, y: number,
    }
  }
}

function createParticle(x, y, index) {
  x = x - particleSize / 2
  y = y - particleSize / 2
  const particle = document.createElement('div')
  particle.style.position = 'fixed'
  particle.style.left = x + 'px'
  particle.style.top = y + 'px'
  particle.style.width = particleSize + 'px'
  particle.style.height = particleSize + 'px'
  particle.style.borderRadius = particleSize + 'px'
  if (particleColor instanceof Array) {
    particle.style.backgroundColor = particleColor[index % particleColor.length]
  } else {
    particle.style.backgroundColor = particleColor
  }

  const angle = (index * (360 / numberOfParticle) - 90) * Math.PI / 180
  particle.endPos = {  // 计算出每个粒子消失点的位置
    x: Math.cos(angle) * particleDistance,
    y: Math.sin(angle) * particleDistance,
  }

  document.body.appendChild(particle)
  return particle
}

export function fire(x, y) {
  const particles = []
  for (let i = 0; i < numberOfParticle; i++) {
    particles.push(createParticle(x, y, i))
  }
  const circle = createCircle(x, y)

  anime.timeline() // anime时间线动画。文档：https://github.com/juliangarnier/anime#timeline
    .add({ // 粒子飞向各自的结束点
      targets: particles,
      translateX(p) { // transform动画
        return parseFloat(p.endPos.x.toFixed(10))
      },
      translateY(p) {
        return parseFloat(p.endPos.y.toFixed(10))
      },
      easing: 'easeOutExpo',
      duration,
    })
    .add({ // 粒子缩小
      translateX(p) {
        return parseFloat(p.endPos.x.toFixed(10)) // 由于transform已经被之前translate的动画占用，如果还要加scale动画的话就要确保translate不被覆盖。
      },
      translateY(p) {
        return parseFloat(p.endPos.y.toFixed(10))
      },
      targets: particles,
      scale: 0.01,
      easing: 'easeOutQuad',
      duration: 900,
      offset: duration - 900, // 此动画距离动画开始时间的偏移
    })
    .add({
      targets: circle,
      scale: 1,
      borderWidth: circleBorderWidth,
      easing: 'easeOutQuad',
      duration: duration / 3.5,
      offset: 0,
    })
    .add({
      targets: circle,
      borderWidth: 0,
      easing: 'linear',
      duration: duration / 3.5,
      offset: duration / 3.5,
    })
  setTimeout(() => { // 移除动画dom
    particles.forEach((o) => {
      document.body.removeChild(o)
    })
    document.body.removeChild(circle)
  }, duration)
}


export function shake(e) {
  anime({
    targets: e,
    rotate: [
      {value: -30, duration: 200, easing: 'easeOutExpo'},
      {value: 10, duration: 200, easing: 'easeOutExpo'},
      {value: 0, duration: 100, easing: 'linear'},
    ],
    scale: [
      {value: 1.2, duration: 200, easing: 'easeOutExpo'},
      {value: 1, duration: 100, easing: 'linear'},
    ],
  })
}

