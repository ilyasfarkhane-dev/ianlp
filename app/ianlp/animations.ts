import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const createRevealAnimation = (
  elements: gsap.DOMTarget,
  stagger = 0.1,
  delay = 0
) => {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 })
    return
  }

  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: elements,
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
      },
    }
  )
}

export const createScaleInAnimation = (
  elements: gsap.DOMTarget,
  stagger = 0.05,
  delay = 0
) => {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, scale: 1 })
    return
  }

  gsap.fromTo(
    elements,
    {
      opacity: 0,
      scale: 0.95,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger,
      delay,
      ease: 'back.out',
      scrollTrigger: {
        trigger: elements,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  )
}

export const createParallaxAnimation = (element: gsap.DOMTarget) => {
  if (prefersReducedMotion()) return

  gsap.to(element, {
    y: -20,
    scrollTrigger: {
      trigger: element,
      scrub: true,
      markers: false,
    },
  })
}

export const createScrollTriggerClass = (
  trigger: gsap.DOMTarget,
  className: string
) => {
  if (prefersReducedMotion()) {
    gsap.set(trigger, { className: `+${className}` })
    return
  }

  ScrollTrigger.create({
    trigger,
    start: 'top center',
    onEnter: () => gsap.to(trigger, { className: `+${className}` }),
    onLeaveBack: () => gsap.to(trigger, { className: `-${className}` }),
  })
}
