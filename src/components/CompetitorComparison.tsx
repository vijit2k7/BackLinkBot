
import { Check, X } from "lucide-react";

const CompetitorComparison = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why BacklinkBot is better than other services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See why BacklinkBot outperforms traditional link building methods and other services
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-gray-500 font-medium text-sm uppercase tracking-wider">Features</th>
                <th className="px-6 py-4 text-center">
                  <span className="block text-lg font-bold text-gray-900">BacklinkBot</span>
                  <span className="block text-sm text-gray-500">Automated Service</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="block text-lg font-medium text-gray-700">Manual Submission</span>
                  <span className="block text-sm text-gray-500">DIY Approach</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="block text-lg font-medium text-gray-700">Freelancers</span>
                  <span className="block text-sm text-gray-500">Outsourced Work</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Number of Submissions</td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-purple">100-500+</span>
                </td>
                <td className="px-6 py-4 text-center">10-30</td>
                <td className="px-6 py-4 text-center">30-50</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Time Required</td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-purple">Under 10 minutes</span>
                </td>
                <td className="px-6 py-4 text-center">20+ hours</td>
                <td className="px-6 py-4 text-center">7-14 days</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Quality Control</td>
                <td className="px-6 py-4 text-center">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="h-5 w-5 text-red-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Directory Selection Algorithm</td>
                <td className="px-6 py-4 text-center">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="h-5 w-5 text-red-500 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="h-5 w-5 text-red-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Detailed Reporting</td>
                <td className="px-6 py-4 text-center">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="h-5 w-5 text-red-500 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Cost Efficiency</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">High</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Low</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-lg font-medium">The choice is clear - BacklinkBot gives you more submissions with less work and higher quality</p>
        </div>
      </div>
    </div>
  );
};

export default CompetitorComparison;
