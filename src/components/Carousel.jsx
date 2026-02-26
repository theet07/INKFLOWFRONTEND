import { useState, useEffect } from 'react'
const Carousel = ({ images, autoPlay = true, interval = 4000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }

  useEffect(() => {
    if (autoPlay) {
      const timer = setInterval(nextSlide, interval)
      return () => clearInterval(timer)
    }
  }, [autoPlay, interval])

  return (
    <div className="carousel-container" style={{
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div className="carousel-description" style={{
        flex: '1',
        padding: '1rem'
      }}>
        <h4 style={{
          color: 'var(--accent-red)',
          marginBottom: '0.5rem',
          fontSize: '1.2rem'
        }}>
          {images[currentSlide]?.title || images[currentSlide]?.alt}
        </h4>
        <p style={{
          color: 'var(--text-gray)',
          lineHeight: '1.5'
        }}>
          {images[currentSlide]?.description || 'Trabalho artístico único com técnicas avançadas de tatuagem.'}
        </p>
      </div>
      <div className="carousel-image" style={{
        flex: '1',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <img
          src={images[currentSlide]?.src}
          alt={images[currentSlide]?.alt}
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            transition: 'opacity 0.5s ease'
          }}
        />
      </div>
    </div>
  )
}

export default Carousel