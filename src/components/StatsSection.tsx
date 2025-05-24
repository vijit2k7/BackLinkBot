
const StatsSection = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">If you list your Startup manually to 100+ sites</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-6xl font-bold mb-4">20</div>
            <div className="text-gray-600">Hours grunt work</div>
          </div>
          
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-6xl font-bold mb-4">$500</div>
            <div className="text-gray-600">Opportunity Cost</div>
          </div>
          
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-6xl font-bold mb-4">0</div>
            <div className="text-gray-600">new learning</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
