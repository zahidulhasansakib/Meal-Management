import React from "react";
import {
  FiTrendingUp,
  FiPieChart,
  FiCalendar,
  FiDollarSign,
  FiBarChart2,
  FiUsers,
} from "react-icons/fi";

const Statistics = ({
  members = [],
  expenses = [],
  dailyMeals = {},
  mealRate = 0,
}) => {
  // Safe calculations with defaults
  const safeMembers = Array.isArray(members) ? members : [];
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeDailyMeals = dailyMeals || {};

  const totalExpenses = safeExpenses.reduce(
    (sum, e) => sum + (e?.amount || 0),
    0
  );
  const totalMeals = safeMembers.reduce(
    (sum, m) => sum + (m?.totalMeals || 0),
    0
  );
  const avgMealsPerDay = totalMeals / Math.max(30, 1);
  const avgExpensePerDay = totalExpenses / Math.max(30, 1);
  const mealDays = Object.keys(safeDailyMeals).length;
  const avgMealsPerMember =
    safeMembers.length > 0 ? totalMeals / safeMembers.length : 0;
  const maxMemberMeals =
    safeMembers.length > 0
      ? Math.max(...safeMembers.map((m) => m?.totalMeals || 0))
      : 1;

  // Expense categories
  const categories = {
    food: { total: 0, color: "bg-green-500", label: "Food" },
    meat: { total: 0, color: "bg-red-500", label: "Meat" },
    vegetable: { total: 0, color: "bg-emerald-500", label: "Vegetable" },
    gas: { total: 0, color: "bg-orange-500", label: "Gas" },
    utility: { total: 0, color: "bg-blue-500", label: "Utility" },
    other: { total: 0, color: "bg-gray-500", label: "Other" },
  };

  // Calculate category totals
  safeExpenses.forEach((exp) => {
    const category = exp?.category || "other";
    if (categories[category]) {
      categories[category].total += exp.amount || 0;
    } else {
      categories.other.total += exp.amount || 0;
    }
  });

  // If no data to display
  if (safeMembers.length === 0 && safeExpenses.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📊 Detailed Statistics
        </h2>
        <p className="text-gray-600">
          No data available. Add members and expenses to see statistics.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          📊 Detailed Statistics
        </h2>
        <p className="text-gray-600">
          Comprehensive analysis of meals and expenses
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-semibold">Meal Rate</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                ৳{mealRate.toFixed(2)}
              </h3>
            </div>
            <FiDollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-semibold">Total Meals</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {totalMeals}
              </h3>
            </div>
            <FiUsers className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-semibold">Days Tracked</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {mealDays}
              </h3>
            </div>
            <FiCalendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 font-semibold">Avg/Day</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {avgMealsPerDay.toFixed(1)}
              </h3>
            </div>
            <FiTrendingUp className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Breakdown */}
        {totalExpenses > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FiPieChart className="text-blue-500" />
              Expense Breakdown
            </h3>

            <div className="space-y-4">
              {Object.entries(categories)
                .filter(([_, data]) => data.total > 0)
                .map(([category, data]) => {
                  const percentage = (
                    (data.total / totalExpenses) *
                    100
                  ).toFixed(1);

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${data.color}`}></div>
                          <span className="font-medium text-gray-700">
                            {data.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-gray-800">
                            ৳{data.total.toFixed(2)}
                          </span>
                          <span className="text-gray-500 ml-2">
                            ({percentage}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${data.color}`}
                          style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Member Performance */}
        {safeMembers.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FiBarChart2 className="text-green-500" />
              Member Meal Comparison
            </h3>

            <div className="space-y-4">
              {safeMembers
                .sort((a, b) => (b?.totalMeals || 0) - (a?.totalMeals || 0))
                .map((member) => {
                  const memberMeals = member?.totalMeals || 0;

                  return (
                    <div key={member?.id || member?.name} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                            {member?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {member?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500">
                              ৳{(memberMeals * mealRate).toFixed(2)} cost
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800">
                            {memberMeals}
                          </div>
                          <div className="text-sm text-gray-500">meals</div>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                          style={{
                            width: `${(memberMeals / maxMemberMeals) * 100}%`,
                          }}></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
          <h4 className="font-semibold text-blue-700 mb-2">💰 Cost Analysis</h4>
          <p className="text-gray-600 text-sm">
            Average cost per person per day: ৳
            {(avgExpensePerDay / Math.max(safeMembers.length, 1)).toFixed(2)}
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Total monthly budget: ৳{(avgExpensePerDay * 30).toFixed(2)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
          <h4 className="font-semibold text-green-700 mb-2">
            🍽️ Meal Analysis
          </h4>
          <p className="text-gray-600 text-sm">
            Average meals per person: {avgMealsPerMember.toFixed(1)}
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Daily meal average:{" "}
            {(totalMeals / Math.max(mealDays, 1)).toFixed(1)} meals
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
          <h4 className="font-semibold text-purple-700 mb-2">📈 Efficiency</h4>
          <p className="text-gray-600 text-sm">
            Cost per meal: ৳{mealRate.toFixed(2)}
          </p>
          <p className="text-gray-600 text-sm mt-2">
            {
              safeMembers.filter(
                (m) => (m?.totalMeals || 0) > avgMealsPerMember
              ).length
            }{" "}
            members above average
          </p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
