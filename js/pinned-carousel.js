(() => {
  const initPinnedCarousels = () => {
    document.querySelectorAll('.pinned-carousel:not([data-initialized])').forEach(carousel => {
      carousel.dataset.initialized = 'true'

      const track = carousel.querySelector('.pinned-carousel-track')
      const slides = [...carousel.querySelectorAll('.pinned-carousel-slide')]
      const dots = [...carousel.querySelectorAll('.pinned-carousel-dot')]
      if (slides.length < 2) return

      let current = 0
      let timer
      let wheelLocked = false
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const interval = Math.max(Number(carousel.dataset.interval) || 3000, 2500)
      const autoplay = carousel.dataset.autoplay === 'true' && !reduceMotion

      const updateFocusable = (slide, active) => {
        slide.setAttribute('aria-hidden', active ? 'false' : 'true')
        slide.querySelectorAll('a, button').forEach(element => {
          element.tabIndex = active ? 0 : -1
        })
      }

      const goTo = (index, wrap = true) => {
        if (wrap) current = (index + slides.length) % slides.length
        else current = Math.max(0, Math.min(index, slides.length - 1))
        track.style.transform = `translate3d(0, -${current * 100}%, 0)`
        slides.forEach((slide, index) => updateFocusable(slide, index === current))
        dots.forEach((dot, index) => dot.setAttribute('aria-selected', index === current ? 'true' : 'false'))
      }

      const stop = () => {
        window.clearInterval(timer)
        timer = undefined
      }
      const start = () => {
        if (!autoplay || timer) return
        timer = window.setInterval(() => goTo(current + 1), interval)
      }
      const restart = () => {
        stop()
        start()
      }

      dots.forEach(dot => dot.addEventListener('click', () => {
        goTo(Number(dot.dataset.index))
        restart()
      }))

      carousel.addEventListener('keydown', event => {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
        event.preventDefault()
        goTo(current + (event.key === 'ArrowDown' ? 1 : -1))
        restart()
      })

      carousel.addEventListener('wheel', event => {
        if (wheelLocked || Math.abs(event.deltaY) < 24) return
        const direction = event.deltaY > 0 ? 1 : -1
        const canMove = direction > 0 ? current < slides.length - 1 : current > 0
        if (!canMove) return
        event.preventDefault()
        wheelLocked = true
        goTo(current + direction, false)
        restart()
        window.setTimeout(() => { wheelLocked = false }, 600)
      }, { passive: false })

      carousel.addEventListener('mouseenter', stop)
      carousel.addEventListener('mouseleave', start)
      carousel.addEventListener('focusin', stop)
      carousel.addEventListener('focusout', event => {
        if (!carousel.contains(event.relatedTarget)) start()
      })
      document.addEventListener('visibilitychange', () => document.hidden ? stop() : start())

      goTo(0)
      start()
    })
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initPinnedCarousels)
    : initPinnedCarousels()
  document.addEventListener('pjax:complete', initPinnedCarousels)
})()
