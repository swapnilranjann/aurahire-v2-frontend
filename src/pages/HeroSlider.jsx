import React from "react";
import Slider from "react-slick";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/hero-slider.css";

const HeroSlider = () => {
  const settings = {
    fade: true,
    speed: 2000,
    autoplaySpeed: 4000,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    arrows: false,
    dots: true,
  };

  const slides = [
    {
      className: "slider__item-01",
      subtitle: "Welcome to JobPortal",
      title: "Find Your Dream Career Today",
      buttonText: "Browse Jobs",
      buttonLink: "/jobs"
    },
    {
      className: "slider__item-02",
      subtitle: "Thousands of Opportunities",
      title: "Connect With Top Companies",
      buttonText: "Explore Now",
      buttonLink: "/jobs"
    },
    {
      className: "slider__item-03",
      subtitle: "Start Your Journey",
      title: "Your Future Starts Here",
      buttonText: "Get Started",
      buttonLink: "/contact"
    }
  ];

  return (
    <section aria-label="Hero slider" className="hero-slider-section">
      <Slider {...settings} className="hero__slider">
        {slides.map((slide, index) => (
          <div 
            className={`slider__item ${slide.className}`} 
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
          >
            <Container>
              <div className="slider__content">
                <h4 className="text-light mb-3">{slide.subtitle}</h4>
                <h1 className="text-light mb-4">{slide.title}</h1>
                <button className="btn reserve__btn mt-4">
                  <Link to={slide.buttonLink}>{slide.buttonText}</Link>
                </button>
              </div>
            </Container>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default HeroSlider;
