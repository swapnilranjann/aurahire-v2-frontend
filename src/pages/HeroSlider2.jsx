import React from "react";
import Slider from "react-slick";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/hero-slider2.css";

const HeroSlider2 = () => {
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
      className: "hero-slider__item--01",
      subtitle: "Build Your Career",
      title: "Professional Growth Awaits",
      buttonText: "Learn More",
      buttonLink: "/about"
    },
    {
      className: "hero-slider__item--02",
      subtitle: "Expert Guidance",
      title: "Career Support & Resources",
      buttonText: "Contact Us",
      buttonLink: "/contact"
    },
    {
      className: "hero-slider__item--03",
      subtitle: "Success Stories",
      title: "Join Our Growing Community",
      buttonText: "View Jobs",
      buttonLink: "/jobs"
    }
  ];

  return (
    <section aria-label="Secondary hero slider" className="hero-slider-section">
      <Slider {...settings} className="hero-slider">
        {slides.map((slide, index) => (
          <div 
            className={`hero-slider__item ${slide.className}`} 
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
          >
            <Container>
              <div className="hero-slider__content">
                <h4 className="text-light mb-3">{slide.subtitle}</h4>
                <h1 className="text-light mb-4">{slide.title}</h1>
                <button className="btn reserve-btn mt-4">
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

export default HeroSlider2;
