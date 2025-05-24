
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      content: "Day 1 - no backlinks, Day 30 - 400 Backlinks, amazing tool, got 3 customers. Made what I paid for",
      author: "Vikram Kumar",
      title: "Associate Software Engineer",
      stars: 5,
      company: "TechScale Solutions",
      image: "https://i.pravatar.cc/100?img=1"
    },
    {
      id: 2,
      content: "Cool Service. I would show the published link and where afterward as an extra service monetization. Worked well for Moblers",
      author: "Guy Doron",
      title: "CEO",
      stars: 5,
      company: "Moblers",
      image: "https://i.pravatar.cc/100?img=2"
    },
    {
      id: 3,
      content: "Awesome service, worked really well for my company, gave trappdev an instant google search rankings boost",
      author: "Atul Kumar Pandey",
      title: "Founder",
      stars: 4,
      company: "trappdev",
      image: "https://i.pravatar.cc/100?img=3"
    },
    {
      id: 4,
      content: "Backlink Bot provides a fast service for submitting directory pages and gives documentation of proof of workload, increasing my site's outbound links. Tried for AI Math Solver & got over 10k backlinks within a month",
      author: "Hantian Pang",
      title: "CTO",
      stars: 5,
      company: "AI Math Solver",
      image: "https://i.pravatar.cc/100?img=4"
    }
  ];

  const renderStars = (count) => {
    return Array(count).fill(0).map((_, i) => (
      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
    ));
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 mb-4 text-xs font-medium rounded-full bg-purple-dark/20 text-purple-light">
            <span className="mr-1">💬</span>
            <span>CUSTOMER STORIES</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of satisfied founders who have boosted their online presence with BacklinkBot
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="flex">
              {renderStars(5)}
            </div>
            <span className="ml-2 text-gray-600 font-medium">4.9/5 from 200+ reviews</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card bg-white">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden border-2 border-purple-100">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex mb-2">
                    {renderStars(testimonial.stars)}
                  </div>
                  <blockquote className="text-gray-800 mb-3 text-lg font-medium">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-900">{testimonial.author}</span>
                    <div className="flex items-center text-gray-500">
                      <span>{testimonial.title}</span>
                      {testimonial.company && (
                        <>
                          <span className="mx-1">•</span>
                          <span className="text-purple-600">{testimonial.company}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Verified Customer</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <div className="flex flex-wrap gap-6 justify-center max-w-5xl">
            <img src="https://logo.clearbit.com/techcrunch.com" alt="TechCrunch" className="h-8 grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://logo.clearbit.com/producthunt.com" alt="Product Hunt" className="h-8 grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://logo.clearbit.com/forbes.com" alt="Forbes" className="h-8 grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://logo.clearbit.com/mashable.com" alt="Mashable" className="h-8 grayscale hover:grayscale-0 transition-all duration-300" />
            <img src="https://logo.clearbit.com/entrepreneur.com" alt="Entrepreneur" className="h-8 grayscale hover:grayscale-0 transition-all duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
