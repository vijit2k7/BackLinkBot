import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { submitEmail } from "@/lib/api";
import { CheckCircle, EyeIcon, EyeOffIcon, HeartCrack, SendIcon, Mail, Gift, AlertTriangle, Sparkles, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
// Update API key constant
const API_KEY = import.meta.env.VITE_REOON_EMAIL_VERIFIER_API_KEY;
const INSTANTLY_API_KEY = import.meta.env.INSTANTLY_API_KEY;
const INSTANTLY_CAMPAIGN_ID = import.meta.env.VITE_INSTANTLY_CAMPAIGN_ID;
const BEEHIVE_API_KEY = import.meta.env.BEEHIVE_API_KEY;
const BEEHIVE_LIST_ID = import.meta.env.BEEHIVE_LIST_ID;

interface EmailVerificationResponse {
  email: string;
  status: 'valid' | 'invalid' | 'disposable' | 'spamtrap';
  is_valid_syntax: boolean;
  is_disposable: boolean;
  is_role_account: boolean;
  mx_accepts_mail: boolean;
  is_spamtrap: boolean;
  is_free_email: boolean;
}

const verifyEmail = async (email: string): Promise<EmailVerificationResponse> => {
  try {
    const response = await fetch(`https://emailverifier.reoon.com/api/v1/verify?email=${encodeURIComponent(email)}&key=${API_KEY}&mode=quick`);
    if (!response.ok) {
      throw new Error('Email verification failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Email verification error:', error);
    throw new Error('Failed to verify email');
  }
};

interface ExitIntentPopupProps {
  // A function to be called when a user successfully submits their email
  onEmailSubmit?: (email: string) => void;
}

const handleAddLead = async (email: string) => {
  try {
    const baseUrl = import.meta.env.DEV ? 'http://localhost:9999' : '';
    const response = await axios.post(
      `${baseUrl}/.netlify/functions/instantly-proxy`,
      { 
        email,
        campaignId: INSTANTLY_CAMPAIGN_ID
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("Lead added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding lead:", error);
    // Don't throw the error - we want the form submission to succeed even if Instantly fails
    return null;
  }
};

// Add Beehiiv subscriber
const addToBeehiiv = async (email: string) => {
  try {
    const baseUrl = import.meta.env.DEV ? 'http://localhost:9999' : '';
    const response = await axios.post(
      `${baseUrl}/.netlify/functions/beehiiv-proxy`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("Successfully added to Beehiiv:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding to Beehiiv:", error);
    return null;
  }
};

const ExitIntentPopup = ({ onEmailSubmit }: ExitIntentPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isEyePeeking, setIsEyePeeking] = useState(false);
  const [popupStage, setPopupStage] = useState<'initial' | 'revealed' | 'submitting' | 'success' | 'closing'>('initial');
  const [sadAnimation, setSadAnimation] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [emailValidationMessage, setEmailValidationMessage] = useState<string | null>(null);
  const eyeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sparkleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mobileTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Function to check if device is mobile
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  };

  // Function to show popup
  const showPopup = useCallback(() => {
    if (!hasShownPopup) {
      setIsOpen(true);
      sessionStorage.setItem("exitIntentPopupShown", "true");
      setHasShownPopup(true);
      setPopupStage('initial');
      setTimeout(() => setPopupStage('revealed'), 300);
      setTimeout(() => {
        setSadAnimation(true);
        setTimeout(() => setSadAnimation(false), 2000);
      }, 700);
    }
  }, [hasShownPopup]);

  // Check if the popup has been shown in this session or if user has already subscribed
  useEffect(() => {
    const popupShown = sessionStorage.getItem("exitIntentPopupShown");
    const hasSubscribed = localStorage.getItem("exitIntentSubscribed");
    
    if (popupShown || hasSubscribed) {
      setHasShownPopup(true);
    }
  }, []);

  // Mobile-specific behavior
  useEffect(() => {
    // Only proceed if we're on mobile and haven't shown the popup
    if (typeof window !== 'undefined' && isMobile() && !hasShownPopup) {
      console.log('Setting up mobile timer...'); // Debug log

      // Clear any existing timer
      if (mobileTimerRef.current) {
        clearTimeout(mobileTimerRef.current);
      }

      // Set up 10-second timer for mobile
      mobileTimerRef.current = setTimeout(() => {
        console.log('Mobile timer triggered!'); // Debug log
        showPopup();
      }, 30000);

      // Set up scroll detection for mobile
      const handleScroll = () => {
        const testimonialSection = document.querySelector('#testimonials');
        if (testimonialSection) {
          const testimonialPosition = testimonialSection.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          
          if (testimonialPosition < windowHeight && !hasShownPopup) {
            showPopup();
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      
      return () => {
        if (mobileTimerRef.current) {
          clearTimeout(mobileTimerRef.current);
        }
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [hasShownPopup, showPopup]);

  // Desktop exit intent behavior
  useEffect(() => {
    if (!isMobile() && !hasShownPopup) {
      const handleExitIntent = (e: MouseEvent) => {
        if (e.clientY <= 5) {
          showPopup();
        }
      };

      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (!hasShownPopup) {
          showPopup();
          e.returnValue = "";
          return "";
        }
      };
      
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && !hasShownPopup) {
          const handleReturn = () => {
            if (!hasShownPopup) {
              showPopup();
            }
            document.removeEventListener('visibilitychange', handleReturn);
          };
          document.addEventListener('visibilitychange', handleReturn);
        }
      };

      document.addEventListener("mouseleave", handleExitIntent);
      window.addEventListener("beforeunload", handleBeforeUnload);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener("mouseleave", handleExitIntent);
        window.removeEventListener("beforeunload", handleBeforeUnload);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }
  }, [hasShownPopup, showPopup]);

  // Eye peeking animation
  useEffect(() => {
    if (isEmailFocused) {
      // Handle random eye peeking
      const startRandomPeeking = () => {
        const randomPeek = () => {
          // Randomly peek between 0.5 and 2 seconds
          const peekTime = Math.random() * 1500 + 500;
          setIsEyePeeking(true);
          
          setTimeout(() => {
            setIsEyePeeking(false);
            
            // Schedule next peek after 1-4 seconds
            const nextPeekDelay = Math.random() * 3000 + 1000;
            eyeTimerRef.current = setTimeout(randomPeek, nextPeekDelay);
          }, peekTime);
        };
        
        // Start the first peek after a random delay
        eyeTimerRef.current = setTimeout(randomPeek, Math.random() * 1000 + 500);
      };
      
      startRandomPeeking();
      
      // Clean up timers on blur
      return () => {
        if (eyeTimerRef.current) {
          clearTimeout(eyeTimerRef.current);
        }
      };
    }
  }, [isEmailFocused]);

  // Sparkle animation for success
  useEffect(() => {
    if (popupStage === 'success') {
      const sparkleInterval = setInterval(() => {
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 800);
      }, 1500);
      
      sparkleTimerRef.current = sparkleInterval as unknown as NodeJS.Timeout;
      
      return () => {
        if (sparkleTimerRef.current) {
          clearInterval(sparkleTimerRef.current);
        }
      };
    }
  }, [popupStage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailValidationMessage("Please enter a valid email address");
      setSadAnimation(true);
      setTimeout(() => setSadAnimation(false), 2000);
      return;
    }

    setIsSubmitting(true);
    setEmailValidationMessage(null);

    try {
      // Verify email first
      const verificationResult = await verifyEmail(email);
      console.log('Verification result:', verificationResult);
      
      let shouldBlock = false;
      let blockReason = "";

      // Handle different verification scenarios
      if (!verificationResult.is_valid_syntax) {
        shouldBlock = true;
        blockReason = "The email format appears to be invalid. Please check for typos.";
      } else if (verificationResult.is_disposable || verificationResult.status === 'disposable') {
        shouldBlock = true;
        blockReason = "We don't accept temporary or disposable email addresses. Please use your regular email address.";
      } else if (verificationResult.is_spamtrap || verificationResult.status === 'spamtrap') {
        shouldBlock = true;
        blockReason = "This email address has been flagged as potentially harmful. Please use a different email address.";
      } else if (verificationResult.is_role_account) {
        shouldBlock = true;
        blockReason = "We don't accept role-based email addresses (like info@, support@, etc.). Please use your personal work email.";
      } else if (!verificationResult.mx_accepts_mail) {
        shouldBlock = true;
        blockReason = "This email domain doesn't appear to accept mail. Please check the spelling or use a different email address.";
      } else if (verificationResult.status === 'invalid') {
        shouldBlock = true;
        blockReason = "This email address appears to be invalid. Please double-check and try again.";
      }

      // If email validation failed, show the specific error and return
      if (shouldBlock) {
        setEmailValidationMessage(blockReason);
        setIsSubmitting(false);
        setSadAnimation(true);
        setTimeout(() => setSadAnimation(false), 2000);
        return;
      }

      // If we get here, the email is valid, proceed with sending the email
      setPopupStage('submitting');

      // Continue with existing submission logic
      const result = await submitEmail(email, 'exit-intent');
      
      if (!result.success) {
        throw new Error(result.message);
      }

      // Add to Beehiiv
      try {
        await addToBeehiiv(email);
      } catch (beehiivError) {
        console.error("Error adding to Beehiiv:", beehiivError);
        // Don't block the submission if Beehiiv fails
      }

      // Only add to Instantly if email validation passed
      try {
        await handleAddLead(email);
      } catch (instantlyError) {
        console.error("Error adding to Instantly:", instantlyError);
        // Don't block the submission if Instantly fails
      }

      if (onEmailSubmit) {
        onEmailSubmit(email);
      }
      
      setSubmitted(true);
      setPopupStage('success');
      
      toast({
        title: "Thank you!",
        description: "You'll receive our directory list shortly.",
      });
      
      localStorage.setItem("exitIntentSubscribed", "true");
      
      setTimeout(() => {
        setPopupStage('closing');
        setTimeout(() => {
          setIsOpen(false);
          
          setTimeout(() => {
            setSubmitted(false);
            setEmail("");
            setPopupStage('initial');
          }, 300);
        }, 500);
      }, 4000);
    } catch (error) {
      console.error('Submission error:', error); // Debug log
      setEmailValidationMessage(
        error instanceof Error 
          ? error.message 
          : "Unable to verify email at this time. Please try again later."
      );
      setIsSubmitting(false);
      setPopupStage('revealed');
      setSadAnimation(true);
      setTimeout(() => setSadAnimation(false), 2000);
    } finally {
      if (isSubmitting) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Only allow closing if not in submitting state
      if (!isSubmitting) {
        if (!open) {
          setPopupStage('closing');
          setTimeout(() => {
            setIsOpen(open);
            
            // Reset states when closing
            setTimeout(() => {
              if (submitted) {
                setSubmitted(false);
                setEmail("");
                setPopupStage('initial');
              }
            }, 300);
          }, 300);
        } else {
          setIsOpen(open);
        }
      }
    }}>
      <DialogContent className="sm:max-w-md max-w-[95vw] bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-xl p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {submitted ? (
            // Success State
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-6 px-6 text-center space-y-5 relative overflow-hidden"
            >
              {/* Background decorations */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                  className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-green-100 opacity-30" 
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-green-200 opacity-30" 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                />
              </div>
              
              {/* Sparkles */}
              <AnimatePresence>
                {showSparkles && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-10 left-10"
                    >
                      <Sparkles className="h-6 w-6 text-yellow-400" />
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="absolute top-16 right-12"
                    >
                      <Sparkles className="h-5 w-5 text-amber-500" />
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="absolute bottom-20 left-1/2"
                    >
                      <Sparkles className="h-8 w-8 text-yellow-300" />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 0.7, times: [0, 0.6, 1] }}
                className="relative z-10"
              >
                <div className="bg-green-50 p-4 rounded-full inline-block shadow-sm">
                  <div className="bg-green-100 p-3 rounded-full inline-block">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative z-10"
              >
                <DialogTitle className="text-2xl md:text-3xl font-bold text-green-700 mb-2">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    Thanks for subscribing!
                  </motion.span>
                </DialogTitle>
                
                <DialogDescription className="py-2 text-base md:text-lg text-gray-700">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    We've sent the list of 50+ startup directories to your email. 
                  </motion.span>
                  <br />
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    Please check your inbox (and spam folder just in case).
                  </motion.span>
                </DialogDescription>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="mt-6 relative z-10"
                >
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-green-100 shadow-sm">
                    <p className="text-gray-600 italic flex items-center justify-center gap-2">
                      <Gift className="h-4 w-4 text-green-500" />
                      <span>"Great things often start with a single email..."</span>
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            // Form State
            <motion.div
              key="form"
              initial={popupStage === 'initial' ? { opacity: 0, scale: 0.9, y: 20 } : false}
              animate={
                popupStage === 'closing' 
                  ? { opacity: 0, scale: 0.9, y: -20 } 
                  : { opacity: 1, scale: 1, y: 0 }
              }
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden p-6"
            >
              {/* Background elements */}
              <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blue-100 opacity-50" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-purple-100 opacity-50" />
              <motion.div 
                className="absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-yellow-50 opacity-40"
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-24 h-24 rounded-tr-full bg-pink-50 opacity-40"
                animate={{ rotate: [0, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <div className="relative">
                <div className="absolute -top-4 -right-4 opacity-20">
                  <Mail size={80} className="text-blue-400" />
                </div>
                
                {/* Header with sad animation */}
                <motion.div 
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      animate={
                        sadAnimation 
                          ? { scale: [1, 1.2, 1], rotate: [0, -10, 0, -10, 0, -5, 0], y: [0, -5, 0] } 
                          : { rotate: [0, -10, 0, -10, 0] }
                      }
                      transition={
                        sadAnimation 
                          ? { duration: 2 } 
                          : { duration: 1.5, delay: 0.5, repeat: 2 }
                      }
                      className="relative"
                    >
                      <HeartCrack size={32} className="text-red-500 relative z-10" />
                      {sadAnimation && (
                        <motion.div
                          initial={{ opacity: 0, y: 0 }}
                          animate={{ opacity: [0, 1, 0], y: [-5, -15, -25] }}
                          transition={{ duration: 1.5 }}
                          className="absolute text-lg"
                          style={{ left: '50%', top: '-5px', transform: 'translateX(-50%)' }}
                        >
                          😢
                        </motion.div>
                      )}
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <DialogTitle className="text-xl font-bold text-gray-800">
                        Wait! Before you go...
                      </DialogTitle>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <DialogDescription className="py-2 relative z-10 text-gray-700">
                      Get our <span className="font-semibold text-blue-600 inline-block relative">
                        exclusive list of 170+ startup directories and Hackers Guide on Getting your Startup Noticed
                        <motion.div 
                          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-400"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                        />
                      </span>The Ultimate Guide packed with secrets you need to steal traffic from your competitors
                    </DialogDescription>
                  </motion.div>
                </motion.div>
                
                {/* Feature list */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="my-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg text-sm border border-blue-100 shadow-sm relative z-10"
                >
                  <p className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>What does Hackers Guide includes:</span>
                  </p>
                  
                  <ul className="space-y-3 list-none pl-0 text-gray-700">
                    {[
                      { text: "170+ High-authority startup directories", icon: "🔍", delay: 0.5 },
                      { text: "The MVP way of stealing traffic from your competitors", icon: "🎯", delay: 0.6 },
                      { text: "Hidden gems that only Indie Hackers know about", icon: "💎", delay: 0.7 },
                      { text: "Building Backlinks in weeks what takes a year usually", icon: "✅", delay: 0.8 }
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: item.delay }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, 0] }}
                          transition={{ duration: 1, delay: index * 0.2 + 1, repeat: 3, repeatType: "mirror" }}
                          className="text-lg"
                        >
                          {item.icon}
                        </motion.div>
                        <span>{item.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <motion.div
                    className="absolute -bottom-2 -right-2 rotate-12 text-2xl"
                    animate={{ rotate: [12, 20, 12], y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                  >
                    🚀
                  </motion.div>
                </motion.div>
                
                {/* Email form */}
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-4 pt-2 relative z-10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="space-y-2">
                    <div className="relative">
                      <motion.div
                        className="absolute -top-3 -left-3 text-xl"
                        animate={isEmailFocused ? { rotate: [0, 10, 0], scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        ✉️
                      </motion.div>
                      
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailValidationMessage(null);
                        }}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                        required
                        className={`w-full pr-10 pl-4 py-6 text-base border-blue-200 focus:border-blue-400 rounded-lg transition-all duration-300 
                          ${email.length > 0 ? 'border-blue-300 bg-blue-50/30' : ''} 
                          ${isEmailFocused ? 'shadow-md' : 'shadow-sm'}
                          ${emailValidationMessage ? 'border-red-300 focus:border-red-400' : ''}`}
                        disabled={isSubmitting}
                      />
                      
                      <motion.div 
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        animate={isEyePeeking ? { 
                          y: [0, -3, 0],
                          scale: [1, 1.15, 1],
                        } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative">
                          {isEyePeeking ? (
                            <EyeIcon className="h-6 w-6 text-blue-500" />
                          ) : (
                            <EyeOffIcon className="h-6 w-6 text-gray-400" />
                          )}
                          
                          {isEyePeeking && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              className="absolute -top-4 -right-3 text-xs"
                            >
                              👀
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                    
                    {emailValidationMessage && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm text-red-500 flex items-center gap-1 ml-1"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {emailValidationMessage}
                      </motion.p>
                    )}
                    
                    <p className="text-xs text-gray-500 flex items-center gap-1 ml-1">
                      <motion.span 
                        animate={{ rotateY: isEmailFocused ? [0, 180, 360] : 0 }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                        className="inline-block"
                      >
                        🔒
                      </motion.span>
                      <span>We respect your privacy and will never share your email.</span>
                    </p>
                  </div>
                  
                  <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setPopupStage('closing');
                          setTimeout(() => setIsOpen(false), 300);
                        }}
                        className="w-full sm:w-auto border-gray-300 hover:bg-gray-100 transition-all duration-300 group relative flex items-center gap-2"
                        disabled={isSubmitting}
                      >
                        <XCircle className="h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
                        <span>No thanks</span>
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full sm:w-auto shadow-md hover:shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2 py-6 px-5 text-base
                          ${popupStage === 'submitting' ? 'animate-pulse' : ''}
                        `}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <SendIcon className="h-5 w-5" />
                            </motion.div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              whileTap={{ scale: 0.9 }}
                              animate={{ y: [0, -3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
                            >
                              <SendIcon className="h-5 w-5" />
                            </motion.div>
                            <span>Send me the directory list</span>
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </DialogFooter>
                </motion.form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup; 