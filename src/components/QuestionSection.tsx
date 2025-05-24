import { Button } from "@/components/ui/button";

const QuestionSection = () => {
  return (
    <div className="bg-white py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-purple to-purple-dark text-white p-8 md:p-10 rounded-3xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Got more Questions?</h2>
              <p className="text-gray-100 text-lg">
                Is anything bothering you? Shoot your question to my Twitter DM.
              </p>
              <div className="mt-6 inline-flex items-center py-2.5 px-5 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white text-sm border border-white border-opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>ASAP Reply</span>
              </div>
            </div>
            <div>
              <a href="https://x.com/whatsuppiyush" target="_blank" rel="noopener noreferrer">
                <Button className="bg-white text-purple-dark hover:bg-gray-100 px-6 py-3 h-auto font-medium text-lg rounded-full shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  Ask from Builder
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionSection;
