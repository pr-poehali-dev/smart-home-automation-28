import { useEffect, useRef, useState } from 'react'
import { useScroll, useSpring, motion } from 'framer-motion'
import Layout from './Layout'

const pages = [
  { id: 1, src: 'https://cdn.poehali.dev/projects/d9438729-e716-46ce-97dd-0acb692488b6/bucket/bd6c0bed-f8c6-4405-84ac-bf5b315b2a39.png', alt: 'Страница 1' },
  { id: 2, src: 'https://cdn.poehali.dev/projects/d9438729-e716-46ce-97dd-0acb692488b6/bucket/ca194c0b-cca8-4012-bac8-a0b56593aecb.png', alt: 'Страница 2' },
  { id: 3, src: 'https://cdn.poehali.dev/projects/d9438729-e716-46ce-97dd-0acb692488b6/bucket/24849ff0-f1a8-49ea-9154-a1e3547bea2e.png', alt: 'Страница 3' },
]

export default function LandingPage() {
  const [activePage, setActivePage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollTop
        const windowHeight = window.innerHeight
        setActivePage(Math.round(scrollPosition / windowHeight))
      }
    }
    const container = containerRef.current
    if (container) container.addEventListener('scroll', handleScroll)
    return () => { if (container) container.removeEventListener('scroll', handleScroll) }
  }, [])

  const goTo = (index: number) => {
    containerRef.current?.scrollTo({ top: index * window.innerHeight, behavior: 'smooth' })
  }

  return (
    <Layout>
      {/* Прогресс-бар */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-white origin-left z-30"
        style={{ scaleX }}
      />

      {/* Навигация по точкам */}
      <nav className="fixed top-0 right-0 h-screen flex flex-col justify-center z-30 p-4 gap-2">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === activePage ? 'bg-white scale-150' : 'bg-gray-500'
            }`}
          />
        ))}
      </nav>

      {/* Счётчик страниц */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 text-white/60 text-sm font-mono">
        {activePage + 1} / {pages.length}
      </div>

      {/* Слайды */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory"
      >
        {pages.map((page, index) => (
          <div
            key={page.id}
            className="h-screen w-full snap-start flex items-center justify-center bg-black"
          >
            <img
              src={page.src}
              alt={page.alt}
              className="h-full w-full object-contain select-none"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </Layout>
  )
}