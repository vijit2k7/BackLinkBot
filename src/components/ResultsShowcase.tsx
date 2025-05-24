
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ResultsShowcase = () => {
  const [selectedTab, setSelectedTab] = useState("traffic");
  
  const trafficData = [
    { month: 'Jan', beforeBot: 0, afterBot: 0 },
    { month: 'Feb', beforeBot: 10, afterBot: 100 },
    { month: 'Mar', beforeBot: 20, afterBot: 300 },
    { month: 'Apr', beforeBot: 54, afterBot: 500 },
    { month: 'May', beforeBot: 70, afterBot: 700 },
    { month: 'Jun', beforeBot: 100, afterBot: 1000 },
  ];
  
  // const rankingData = [
  //   { keyword: 'Startup Directory', beforeBot: 67, afterBot: 12 },
  //   { keyword: 'Best SaaS Tools', beforeBot: 89, afterBot: 21 },
  //   { keyword: 'Product Hunt Alt', beforeBot: 120, afterBot: 34 },
  //   { keyword: 'Indie Maker Tools', beforeBot: 73, afterBot: 18 },
  //   { keyword: 'Startup Promotion', beforeBot: 95, afterBot: 23 },
  // ];
  
  // const conversionData = [
  //   { month: 'Jan', rate: 1.2 },
  //   { month: 'Feb', rate: 2.3 },
  //   { month: 'Mar', rate: 3.1 },
  //   { month: 'Apr', rate: 3.8 },
  //   { month: 'May', rate: 4.2 },
  //   { month: 'Jun', rate: 4.7 },
  // ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 mb-4 text-xs font-medium rounded-full bg-purple-dark/20 text-purple-light">
            <span className="mr-1">📈</span>
            <span>REAL RESULTS</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">See What BacklinkBot Can Do For You</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real data from our customers showing the impact BacklinkBot has on their business metrics
          </p>
        </div>
        
        <Tabs defaultValue="traffic" onValueChange={setSelectedTab} className="w-full">
          
            <div className="bg-white p-6 rounded-xl shadow-sm border h-[400px]">
              <h3 className="text-xl font-semibold mb-6 text-center">Average Monthly Traffic Before vs After BacklinkBot</h3>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="beforeBot" stroke="#8884d8" name="Before BacklinkBot" strokeWidth={2} />
                  <Line type="monotone" dataKey="afterBot" stroke="#82ca9d" name="After BacklinkBot" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          
          {/* <TabsContent value="rankings" className="mt-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border h-[400px]">
              <h3 className="text-xl font-semibold mb-6 text-center">Google Rankings Improvement (Position)</h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={rankingData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="keyword" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="beforeBot" fill="#8884d8" name="Before BacklinkBot" />
                  <Bar dataKey="afterBot" fill="#82ca9d" name="After BacklinkBot" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-gray-500 mt-4">Lower position is better (closer to #1)</p>
            </div>
          </TabsContent>
          
          <TabsContent value="conversions" className="mt-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border h-[400px]">
              <h3 className="text-xl font-semibold mb-6 text-center">Average Conversion Rate Improvement</h3>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#8884d8" name="Conversion Rate %" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-gray-500 mt-4">Average conversion rate increase after implementing BacklinkBot</p>
            </div>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
};

export default ResultsShowcase;
