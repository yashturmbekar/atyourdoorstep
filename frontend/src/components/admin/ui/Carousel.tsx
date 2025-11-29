/**
 * Carousel Component
 * Responsive image/content carousel with navigation
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Carousel.css';

export interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  className?: string;
  slideClassName?: string;
  onSlideChange?: (index: number) => void;
}

export interface CarouselSlideProps {
  children: React.ReactNode;
  className?: string;
}

export const CarouselSlide: React.FC<CarouselSlideProps> = ({
  children,
  className = '',
}) => <div className={`carousel-slide ${className}`}>{children}</div>;

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  loop = true,
  className = '',
  slideClassName = '',
  onSlideChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = React.Children.count(children);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;

      let newIndex = index;
      if (loop) {
        if (index < 0) newIndex = totalSlides - 1;
        if (index >= totalSlides) newIndex = 0;
      } else {
        newIndex = Math.max(0, Math.min(index, totalSlides - 1));
      }

      setIsTransitioning(true);
      setCurrentIndex(newIndex);
      onSlideChange?.(newIndex);

      setTimeout(() => setIsTransitioning(false), 300);
    },
    [isTransitioning, loop, totalSlides, onSlideChange]
  );

  const goToPrev = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  // Auto play
  useEffect(() => {
    if (autoPlay && !isDragging) {
      autoPlayRef.current = setInterval(goToNext, autoPlayInterval);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, goToNext, isDragging]);

  // Touch/Mouse handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStart(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const offset = clientX - dragStart;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = containerRef.current
      ? containerRef.current.offsetWidth * 0.2
      : 100;

    if (dragOffset > threshold) {
      goToPrev();
    } else if (dragOffset < -threshold) {
      goToNext();
    }

    setDragOffset(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const handleMouseUp = () => handleDragEnd();
  const handleMouseLeave = () => {
    if (isDragging) handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) =>
    handleDragStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) =>
    handleDragMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleDragEnd();

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  };

  const canGoPrev = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < totalSlides - 1;

  return (
    <div
      className={`carousel ${className}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
    >
      {/* Track */}
      <div
        className="carousel-track-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`carousel-track ${isTransitioning ? 'transitioning' : ''} ${isDragging ? 'dragging' : ''}`}
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {React.Children.map(children, (child, index) => (
            <div
              className={`carousel-slide-wrapper ${slideClassName}`}
              aria-hidden={index !== currentIndex}
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${totalSlides}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            className={`carousel-arrow carousel-arrow-prev ${!canGoPrev ? 'disabled' : ''}`}
            onClick={goToPrev}
            disabled={!canGoPrev}
            aria-label="Previous slide"
          >
            <FiChevronLeft />
          </button>
          <button
            className={`carousel-arrow carousel-arrow-next ${!canGoNext ? 'disabled' : ''}`}
            onClick={goToNext}
            disabled={!canGoNext}
            aria-label="Next slide"
          >
            <FiChevronRight />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && totalSlides > 1 && (
        <div className="carousel-dots" role="tablist">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="carousel-counter">
        {currentIndex + 1} / {totalSlides}
      </div>
    </div>
  );
};

export default Carousel;
