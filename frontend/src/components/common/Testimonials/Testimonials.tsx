import { useState, useEffect } from 'react';
import './Testimonials.css';

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Mumbai Resident',
      image: 'PS',
      rating: 5,
      text: "The mangoes were unbelievably fresh and sweet! You can taste the authentic Ratnagiri flavor in every bite. Best Alphonso mangoes I've had outside of Maharashtra.",
    },
    {
      name: 'Ramesh Kumar',
      role: 'Bangalore Food Lover',
      image: 'RK',
      rating: 5,
      text: 'Your jaggery reminds me of the kind we had growing up in my village. So pure and rich in taste - no artificial sweetness. Finally found authentic jaggery in the city!',
    },
    {
      name: 'Neha Joshi',
      role: 'Pune Homemaker',
      image: 'NJ',
      rating: 5,
      text: "Finally found oil that smells and tastes just like my grandmother's kitchen! The cold-pressed groundnut oil is amazing - you can actually taste the difference.",
    },
    {
      name: 'Arjun Patel',
      role: 'Delhi Chef',
      image: 'AP',
      rating: 5,
      text: "As a chef, I'm very particular about ingredients. AtYourDoorStep's products are restaurant-quality. The coconut oil and sesame oil have incredible aroma and purity.",
    },
    {
      name: 'Kavitha Reddy',
      role: 'Hyderabad Health Enthusiast',
      image: 'KR',
      rating: 5,
      text: "Switched to their organic jaggery and cold-pressed oils completely. The health benefits are noticeable, and knowing they're chemical-free gives me peace of mind.",
    },
    {
      name: 'Vikram Singh',
      role: 'Gurgaon Executive',
      image: 'VS',
      rating: 5,
      text: 'Ordered mangoes for my parents in Punjab - they were thrilled! The packaging was excellent, and every mango was perfectly ripe. Will definitely order again next season.',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex(
      currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="testimonials" className="testimonials section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-label">Testimonials</span>
          <h2>What Our Customers Say</h2>
          <p className="section-description">
            Don't just take our word for it. Here's what our valued customers
            have to say about their experience with AtYourDoorStep.
          </p>
        </div>
        <div className="testimonials-container">
          <div className="testimonials-slider">
            {' '}
            <div
              className="testimonials-track"
              style={
                {
                  '--translate-x': `-${currentIndex * 100}%`,
                } as React.CSSProperties
              }
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-slide">
                  <div className="testimonial-card">
                    <div className="testimonial-content">
                      <div className="rating">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg
                            key={i}
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 2L15.09 8.26L23 9L17 14.74L18.18 22.02L12 18.77L5.82 22.02L7 14.74L1 9L8.91 8.26L12 2Z"
                              fill="currentColor"
                            />
                          </svg>
                        ))}
                      </div>
                      <blockquote>"{testimonial.text}"</blockquote>
                      <div className="testimonial-author">
                        <div className="author-avatar">{testimonial.image}</div>
                        <div className="author-info">
                          <h4>{testimonial.name}</h4>
                          <p>{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="slider-controls">
            <button
              className="slider-btn prev-btn"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="slider-btn next-btn"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="slider-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${currentIndex === index ? 'active' : ''}`}
                onClick={() => goToTestimonial(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>{' '}
        <div className="customer-highlights">
          <h3>What Our Customers Love Most</h3>
          <div className="highlights-grid">
            <div className="highlight-item">
              <span className="highlight-number">96%</span>
              <p>Love the authentic taste and freshness</p>
            </div>
            <div className="highlight-item">
              <span className="highlight-number">94%</span>
              <p>Appreciate the chemical-free, organic quality</p>
            </div>
            <div className="highlight-item">
              <span className="highlight-number">92%</span>
              <p>Impressed by the careful packaging and delivery</p>
            </div>
            <div className="highlight-item">
              <span className="highlight-number">98%</span>
              <p>Would order again and recommend to friends</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
