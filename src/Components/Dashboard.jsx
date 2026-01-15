import React from "react";
import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiCoffee,
  FiCheckCircle,
  FiXCircle,
  FiUser,
} from "react-icons/fi";

const Dashboard = ({
  members,
  totalSharedExpense,
  mealRate,
  totalIndividualExpense,
  totalMeals,
}) => {
  const today = new Date().toLocaleDateString("en-BD");

  // Calculate each member's details
  const calculateMemberDetails = (member) => {
    const mealCost = member.totalMeals * (parseFloat(mealRate) || 0);
    const balance = member.totalIndividualExpense - mealCost;

    return {
      mealCost: mealCost.toFixed(2),
      balance: balance.toFixed(2),
      status: balance >= 0 ? "advanced" : "due",
      statusColor: balance >= 0 ? "text-green-600" : "text-red-600",
      statusBg: balance >= 0 ? "bg-green-100" : "bg-red-100",
      hasPaid: member.hasPaid || false,
    };
  };

  // Get top meal consumers with paid status
  const topMealConsumers = [...members]
    .sort((a, b) => b.totalMeals - a.totalMeals)
    .slice(0, 5);

  // Calculate totals
  const totalPaidAmount = totalIndividualExpense; // Individual Expense থেকে নেয়া
  const currentMealRate = totalMeals > 0 ? totalSharedExpense / totalMeals : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📊 Dashboard Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-semibold">Total Paid Amount</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                ৳{totalPaidAmount}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {members.filter((m) => m.hasPaid).length} members paid
              </p>
            </div>
            <FiDollarSign className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-semibold">Current Meal Rate</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                ৳{parseFloat(currentMealRate).toFixed(2)}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                ৳{totalSharedExpense} ÷ {totalMeals} meals
              </p>
            </div>
            <FiTrendingUp className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-semibold">Total Meals</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {totalMeals}
              </h3>
              <p className="text-sm text-gray-500 mt-1">All members combined</p>
            </div>
            <FiCoffee className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 font-semibold">Individual Expense</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                ৳{totalIndividualExpense}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Name-wise expense</p>
            </div>
            <FiUser className="w-10 h-10 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Expense Summary */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          💰 Expense Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-4 border">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ৳{totalIndividualExpense}
              </div>
              <p className="text-gray-600 text-sm mt-1">Individual Expense</p>
              <p className="text-xs text-gray-500">Name-wise tracking</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ৳{totalSharedExpense}
              </div>
              <p className="text-gray-600 text-sm mt-1">Total Shared Expense</p>
              <p className="text-xs text-gray-500">For meal rate calculation</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ৳{parseFloat(currentMealRate).toFixed(2)}
              </div>
              <p className="text-gray-600 text-sm mt-1">Current Meal Rate</p>
              <p className="text-xs text-gray-500">Per meal cost</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-blue-700 text-sm text-center">
            💡 <span className="font-semibold">Meal Rate Formula:</span>
            Total Shared Expense (৳{totalSharedExpense}) ÷ Total Meals (
            {totalMeals}) = ৳{parseFloat(currentMealRate).toFixed(2)} per meal
          </p>
        </div>
      </div>

      {/* Top Meal Consumers with Paid/Due Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Meal Consumers Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            👥 Top Meal Consumers
          </h3>
          <div className="space-y-4">
            {topMealConsumers.map((member) => {
              const details = calculateMemberDetails(member);
              const mealCost =
                member.totalMeals * (parseFloat(currentMealRate) || 0);

              return (
                <div
                  key={member.id}
                  className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {member.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">
                            {member.totalMeals} meals
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              details.hasPaid
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                            {details.hasPaid ? "Paid" : "Due"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`text-lg font-bold ${
                        details.balance >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                      {details.balance >= 0 ? "+" : ""}৳
                      {Math.abs(details.balance)}
                    </div>
                  </div>

                  {/* Paid Amount and Calculation */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Paid Amount:</span>
                      <span className="font-semibold text-green-600">
                        ৳{member.totalIndividualExpense}
                        {!details.hasPaid && (
                          <span className="text-red-500 ml-1">(Not Paid)</span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Meal Cost:</span>
                      <span className="font-semibold text-blue-600">
                        ৳{mealCost.toFixed(2)} ({member.totalMeals} × ৳
                        {parseFloat(currentMealRate).toFixed(2)})
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-gray-700 font-medium">
                        Balance:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${details.statusColor}`}>
                          {details.balance >= 0 ? "Advanced" : "Due"}
                        </span>
                        <span className={`font-bold ${details.statusColor}`}>
                          {details.balance >= 0 ? "+" : ""}৳
                          {Math.abs(details.balance)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Individual Expenses Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            💰 Individual Expenses Summary
          </h3>
          <div className="space-y-6">
            {members.slice(0, 4).map((member) => {
              const details = calculateMemberDetails(member);
              const mealCost =
                member.totalMeals * (parseFloat(currentMealRate) || 0);

              return (
                <div
                  key={member.id}
                  className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800">
                          {member.name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${details.statusBg} ${details.statusColor}`}>
                          {details.status === "advanced" ? "Advanced" : "Due"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {member.totalMeals} meals
                      </p>
                    </div>
                  </div>

                  {/* Paid, Cost, Balance */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FiDollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600">Paid:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600">
                          ৳{member.totalIndividualExpense}
                        </span>
                        {!details.hasPaid && (
                          <FiXCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FiCoffee className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600">Cost:</span>
                      </div>
                      <span className="font-bold text-blue-600">
                        ৳{mealCost.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        {details.balance >= 0 ? (
                          <FiCheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <FiXCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-gray-700 font-medium">
                          Balance:
                        </span>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${details.statusColor}`}>
                          {details.balance >= 0 ? "+" : ""}৳
                          {Math.abs(details.balance)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {details.balance >= 0 ? "Advanced" : "Due"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show remaining members in a grid */}
          {members.length > 4 && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-700 mb-3">
                Other Members
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {members.slice(4).map((member) => {
                  const details = calculateMemberDetails(member);
                  const mealCost =
                    member.totalMeals * (parseFloat(currentMealRate) || 0);

                  return (
                    <div
                      key={member.id}
                      className="bg-gray-50 rounded-lg p-3 border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                            {member.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-800 text-sm">
                            {member.name}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${details.statusBg} ${details.statusColor}`}>
                          {details.balance >= 0 ? "+" : ""}৳
                          {Math.abs(details.balance)}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Paid:</span>
                          <span className="font-semibold">
                            ৳{member.totalIndividualExpense}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Cost:</span>
                          <span className="font-semibold">
                            ৳{mealCost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Status Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FiCheckCircle className="text-green-500" />
            Paid Members
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {members.filter((m) => m.hasPaid).length}
            </div>
            <p className="text-gray-600">Members who have paid</p>
            <div className="mt-3 text-sm text-gray-500">
              Total: ৳
              {members
                .filter((m) => m.hasPaid)
                .reduce((sum, m) => sum + m.totalIndividualExpense, 0)}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FiXCircle className="text-red-500" />
            Due Members
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {members.filter((m) => !m.hasPaid).length}
            </div>
            <p className="text-gray-600">Members with due</p>
            <div className="mt-3 text-sm text-gray-500">Need to pay</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FiTrendingUp className="text-purple-500" />
            Total Advanced
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              ৳
              {members
                .filter((m) => m.balance > 0)
                .reduce((sum, m) => sum + m.balance, 0)
                .toFixed(2)}
            </div>
            <p className="text-gray-600">Advanced Amount</p>
            <div className="mt-3 text-sm text-gray-500">
              {members.filter((m) => m.balance > 0).length} members in advance
            </div>
          </div>
        </div>
      </div>

      {/* Today's Date */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-6 py-3 rounded-full">
          <span className="font-semibold text-blue-700">📅 Today:</span>
          <span className="text-gray-800">{today}</span>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-BD", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
