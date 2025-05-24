import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from 'react-helmet-async';
import SinglePage from "./pages/SinglePage";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Glossary from "./pages/Glossary";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Affiliate from "./pages/Affiliate";
import SubmitDirectory from "./pages/SubmitDirectory";
import ToolsGlossary from "./pages/ToolsGlossary";
import Tools from "./pages/Tools";
import BusinessIdeaGenerator from "./tools/BusinessIdeaGenerator";
import DomainNameFinder from "./tools/DomainNameFinder";
import ColorPaletteGenerator from "./tools/ColorPaletteGenerator";
import BusinessNameGenerator from "./tools/BusinessNameGenerator";
import InvoiceGenerator from "./tools/InvoiceGenerator";
import SeoAnalyzer from "./tools/SeoAnalyzer";
import SocialMediaStrategy from "./tools/SocialMediaStrategy";
import HeadlineAnalyzer from "./tools/HeadlineAnalyzer";
import EmailSubjectTester from "./tools/EmailSubjectTester";
import BlogIdeaGenerator from "./tools/BlogIdeaGenerator";
import MetaDescriptionGenerator from "./tools/MetaDescriptionGenerator";
import QrCodeGenerator from "./tools/QrCodeGenerator";
import PrivacyPolicyGenerator from "./tools/PrivacyPolicyGenerator";
import PasswordGenerator from "./tools/PasswordGenerator";
import TermsGenerator from "./tools/TermsGenerator";
import UrlShortener from "./tools/UrlShortener";
import FaviconGenerator from "./tools/FaviconGenerator";
import ImageResizer from "./tools/ImageResizer";
import LogoIdeaGenerator from "./tools/LogoIdeaGenerator";
import MarketingCopyGenerator from "./tools/MarketingCopyGenerator";
import OpenGraphTester from "./tools/OpenGraphTester";
import SitemapGenerator from "./tools/SitemapGenerator";
import KeywordResearchTool from "./tools/KeywordResearchTool";
import WebsiteSpeedAnalyzer from "./tools/WebsiteSpeedAnalyzer";
import PricingStrategyCalculator from "./tools/PricingStrategyCalculator";
import ValuePropositionCreator from "./tools/ValuePropositionCreator";
import ElevatorPitchCreator from "./tools/ElevatorPitchCreator";
import MetaViewport from "./components/MetaViewport";
import ExitIntentPopup from "./components/ExitIntentPopup";
import ScrollToTop from "./components/ScrollToTop";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

// Separate component for animated routes
const AnimatedRoutes = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Create a function to observe elements that can be called after navigation
    const observeSections = () => {
      document.querySelectorAll(".section-fade-in").forEach((el) => {
        // Check if element is already visible (for back navigation)
        if (window.location.pathname === '/' && el.classList.contains('section-fade-in')) {
          // For direct navigation to homepage, ensure elements are visible immediately
          if (!el.classList.contains('appear')) {
            el.classList.add('appear');
          }
        }
      });
    };

    // Use Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear");
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );

    // Observe all fade-in sections
    document.querySelectorAll(".section-fade-in").forEach((el) => {
      observer.observe(el);
    });

    // Initial observation
    observeSections();

    // Re-observe when route changes
    const handleRouteChange = () => {
      setTimeout(observeSections, 100); // Small delay to ensure DOM is updated
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      document.querySelectorAll(".section-fade-in").forEach((el) => {
        observer.unobserve(el);
      });
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<SinglePage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postId" element={<BlogPost />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/seo-tools" element={<ToolsGlossary />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/business-idea-generator" element={<BusinessIdeaGenerator />} />
        <Route path="/tools/domain-name-finder" element={<DomainNameFinder />} />
        <Route path="/tools/color-palette-generator" element={<ColorPaletteGenerator />} />
        <Route path="/tools/business-name-generator" element={<BusinessNameGenerator />} />
        <Route path="/tools/invoice-generator" element={<InvoiceGenerator />} />
        <Route path="/tools/seo-analyzer" element={<SeoAnalyzer />} />
        <Route path="/tools/social-media-strategy" element={<SocialMediaStrategy />} />
        <Route path="/tools/headline-analyzer" element={<HeadlineAnalyzer />} />
        <Route path="/tools/email-subject-tester" element={<EmailSubjectTester />} />
        <Route path="/tools/blog-idea-generator" element={<BlogIdeaGenerator />} />
        <Route path="/tools/meta-description-generator" element={<MetaDescriptionGenerator />} />
        <Route path="/tools/qr-code-generator" element={<QrCodeGenerator />} />
        <Route path="/tools/privacy-policy-generator" element={<PrivacyPolicyGenerator />} />
        <Route path="/tools/password-generator" element={<PasswordGenerator />} />
        <Route path="/tools/terms-generator" element={<TermsGenerator />} />
        <Route path="/tools/url-shortener" element={<UrlShortener />} />
        <Route path="/tools/favicon-generator" element={<FaviconGenerator />} />
        <Route path="/tools/image-resizer" element={<ImageResizer />} />
        <Route path="/tools/logo-idea-generator" element={<LogoIdeaGenerator />} />
        <Route path="/tools/marketing-copy-generator" element={<MarketingCopyGenerator />} />
        <Route path="/tools/open-graph-tester" element={<OpenGraphTester />} />
        <Route path="/tools/sitemap-generator" element={<SitemapGenerator />} />
        <Route path="/tools/keyword-research-tool" element={<KeywordResearchTool />} />
        <Route path="/tools/website-speed-analyzer" element={<WebsiteSpeedAnalyzer />} />
        <Route path="/tools/pricing-strategy-calculator" element={<PricingStrategyCalculator />} />
        <Route path="/tools/value-proposition-creator" element={<ValuePropositionCreator />} />
        <Route path="/tools/elevator-pitch-generator" element={<ElevatorPitchCreator />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/submit-directory" element={<SubmitDirectory />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  // Add effect to handle viewport height for mobile browsers
  useEffect(() => {
    // Fix for mobile viewport height issues
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    
    return () => {
      window.removeEventListener('resize', setVh);
    };
  }, []);

  // Handle email submission
  const handleEmailSubmit = (email: string) => {
    // You could implement additional logic here, such as:
    // - Recording the submission in analytics
    // - Triggering other marketing automation workflows
    
    // For analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'email_capture', {
        'event_category': 'lead_generation',
        'event_label': 'exit_intent',
        'value': 1
      });
    }
    
    // Log the submission (this will also be handled by the API)
    console.log("Email captured via exit intent:", email);
  };

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <ScrollToTop />
            <MetaViewport />
            <div className="bg-white min-h-screen overflow-x-hidden max-w-[100vw]">
              <AnimatedRoutes />
            </div>
          </BrowserRouter>
          <ExitIntentPopup onEmailSubmit={handleEmailSubmit} />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
