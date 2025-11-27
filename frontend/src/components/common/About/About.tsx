import './About.css';

//test1234
export const About = () => {
  const cards = [
    {
      title: 'Our Story',
      icon: '📖',
      content: (
        <>
          <p>
            We began over 30 years ago with a small, traditional jaggery unit
            near sugarcane fields — built on values of purity, tradition, and
            hard work.
          </p>
          <p>
            At the heart of this growth lies a simple yet powerful mission: To
            bring honest, chemical-free, and high-quality products into Indian
            households, while making the process as easy and accessible as
            possible.
          </p>
          <p>
            Today, AtYourDoorstep is more than just a brand — it's a promise of
            purity with convenience, rooted in Indian traditions and powered by
            modern delivery.
          </p>
        </>
      ),
    },
    {
      title: 'Our Spaces',
      icon: '🏭',
      content: (
        <>
          <p>
            <strong>Our Mango Orchards:</strong> Located in Ratnagiri, thriving
            on red laterite soil and clean air, producing premium Alphonso
            mangoes.
          </p>
          <p>
            <strong>Our Jaggery Warehouse:</strong> Built near sugarcane farms,
            where juice is boiled in iron pans over firewood, the traditional
            way.
          </p>
          <p>
            <strong>Our Cold-Pressing Unit:</strong> Operates in a controlled
            hygienic environment, where quality seeds are cold-pressed without
            heat or chemicals.
          </p>
        </>
      ),
    },
    {
      title: 'Our Products',
      icon: '🌱',
      content: (
        <>
          <p>
            <strong>Jaggery:</strong> With over 30 years in the industry, our
            jaggery is made using age-old methods in our own processing facility
            — rich in minerals, free from chemicals.
          </p>
          <p>
            <strong>Cold-Pressed Oils:</strong> Since 2021, we've been
            extracting unrefined oils (coconut, sesame, groundnut, mustard)
            using the traditional wooden ghani method in our cold-pressing
            facility — keeping nutrients intact.
          </p>
          <p>
            <strong>Mangoes:</strong> For the past 4 years, we've been
            hand-picking the finest GI-tagged Alphonso mangoes from Ratnagiri.
            No carbide, no shortcuts — just naturally ripened, sun-kissed
            fruits.
          </p>
        </>
      ),
    },
  ];

  const stats = [
    { number: '30+', label: 'Years of Experience' },
    { number: '100%', label: 'Chemical Free' },
    { number: '3', label: 'Premium Products' },
    { number: '1000+', label: 'Happy Customers' },
  ];

  return (
    <section
      id="about"
      className="about section"
      itemScope
      itemType="https://schema.org/Organization"
      data-content-type="company-information"
      data-crawl-priority="high"
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">About Us</span>
          <h2 itemProp="name">
            Purity, Tradition, and <span className="highlight">Quality</span>
          </h2>
          <p
            className="section-description"
            itemProp="description"
            data-content="company-mission"
          >
            AtYourDoorstep is a proudly Indian, family-run business bringing the
            essence of purity, tradition, and quality directly to your home.
            From the sweetness of our Ratnagiri Alphonso mangoes to the rich
            minerals of our organic jaggery, and the wholesome goodness of our
            cold-pressed oils — we deliver farm-fresh, factory-direct products
            with no middlemen and no compromises.
          </p>
        </div>

        {/* Stats Section */}
        <div
          className="stats-grid"
          data-content="company-statistics"
          itemScope
          itemType="https://schema.org/QuantitativeValue"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="about-stat-item"
              itemProp="value"
              data-stat-type={stat.label.toLowerCase().replace(/\s+/g, '-')}
            >
              <div className="stat-number" itemProp="value">
                {stat.number}
              </div>
              <div className="stat-label" itemProp="name">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Cards Section */}
        <div className="about-content">
          <div className="cards-grid" data-content="company-details">
            {cards.map((card, index) => (
              <div
                key={index}
                className="feature-card"
                itemScope
                itemType="https://schema.org/Thing"
                data-content-section={card.title
                  .toLowerCase()
                  .replace(/\s+/g, '-')}
              >
                <div className="card-icon">{card.icon}</div>
                <h3 className="card-title" itemProp="name">
                  {card.title}
                </h3>
                <div className="card-content" itemProp="description">
                  {card.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="about-cta"
          data-content="call-to-action"
          itemScope
          itemType="https://schema.org/Action"
        >
          <div className="cta-content">
            <h3 itemProp="name">Ready to Experience Pure Quality?</h3>
            <p itemProp="description">
              Discover our range of authentic, farm-fresh products
            </p>
            <button
              className="cta-button"
              itemProp="target"
              onClick={() =>
                document
                  .getElementById('products')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore Our Products
              <span className="button-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
