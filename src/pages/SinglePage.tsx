import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import QuestionSection from "@/components/QuestionSection";
import CallToAction from "@/components/CallToAction";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import TrustBadges from "@/components/TrustBadges";
import ResultsShowcase from "@/components/ResultsShowcase";
import WhyBacklinks from "@/components/WhyBacklinks";
import CompetitorComparison from "@/components/CompetitorComparison";
import ListedWebsites from "@/components/ListedWebsites";
import TestimonialWidget from "@/components/TestimonialWidget";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import ProductDirectories from "@/components/ProductDirectories";
import BacklinkMetrics from "@/components/BacklinkMetrics";
import PageTransition from "@/components/PageTransition";
import FeaturedWebsites from "@/components/FeaturedWebsites";

const SinglePage = () => {
  const [showBanner, setShowBanner] = useState(true);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isInitialMount = useRef(true);

  // Apply fade-in animations to sections
  useEffect(() => {
    // Only run this effect when navigating back to homepage or on initial load
    const sectionEls = sectionsRef.current?.querySelectorAll("section") || [];
    
    // If it's not the initial mount, immediately show all sections without animation
    if (!isInitialMount.current) {
      sectionEls.forEach((section) => {
        // Remove transition delay and immediately make sections visible
        section.style.transitionDelay = "0s";
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
        section.classList.add("appear");
      });
    } else {
      // For initial mount, use progressive animations
      sectionEls.forEach((section, index) => {
        section.classList.add("section-fade-in");
        // Reduce delay for faster appearance
        section.style.transitionDelay = `${index * 0.05}s`;
      });
      isInitialMount.current = false;
    }
  }, [location.pathname]); // Re-run when path changes
  
  // Calculate the top padding based on banner visibility
  const mainPaddingTop = showBanner ? "pt-36" : "pt-32";

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <div className="banner-container relative z-50">
          {showBanner && (
            <AnnouncementBanner 
              isEnabled={false}
              message="🚀 Automate your Twitter Cold Outreach, get 3x more replies than cold emails "
              redirectUrl="https://xautodm.com/"
              backgroundColor="#6B46C1"
            />
          )}
        </div>
        
        <Header bannerVisible={showBanner} />
        
        <main ref={sectionsRef} className={`${mainPaddingTop} -mt-1`}>
          <section id="hero" className="mt-0">
            <HeroSection />
          </section>
          
          <section id="trust-badges" className="py-8">
            <TrustBadges />
          </section>
          
          <section className="w-full py-6 md:py-10 bg-white flex justify-center items-center px-4">
            <div className="w-full max-w-[600px]">
              <img 
                src="/product-customer.png"
                alt="Product connects customers and your product" 
                className="w-full h-auto mx-auto drop-shadow-lg rounded-lg" 
                loading="lazy"
              />
            </div>
          </section>

          <section id="product-directories" className="py-12">
            <ProductDirectories />
          </section>

          <section id="listed-websites" className="py-16">
            <ListedWebsites />
          </section>
          
          <section id="testimonials" className="py-16">
            <TestimonialWidget />
          </section>

          {/* <section id="cta" className="py-16">
            <CallToAction />
          </section> */}
          
          <section id="features" className="py-16">
            <FeatureCards />
          </section>
          
          <section id="backlink-metrics" className="py-16">
            <BacklinkMetrics />
          </section>
          
          {/* <section id="why-backlinks" className="py-16">
            <WhyBacklinks />
          </section> */}
          
          <section id="how-it-works" className="py-16">
            <HowItWorks />
          </section>
          
          {/* <section id="results-showcase" className="py-16">
            <ResultsShowcase />
          </section> */}
          
          {/* <section id="stats" className="py-16">
            <StatsSection />
          </section> */}
          
          <section id="competitor-comparison" className="py-16">
            <CompetitorComparison />
          </section>
          
          <section id="pricing" className="py-16">
            <PricingSection />
          </section>
          
          <section id="faq" className="py-16">
            <FAQSection />
          </section>

          
          <section id="cta" className="py-16">
            <CallToAction />
          </section>
          
          <section id="questions" className="py-16">
            <QuestionSection />
          </section>
          
          <section>
            <FeaturedWebsites />
          </section>
        </main>
        
        <Footer />
        <ScrollToTopButton />
      </div>
    </PageTransition>
  );
};

export default SinglePage;
