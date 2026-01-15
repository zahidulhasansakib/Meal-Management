import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FiUser,
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiTrendingUp,
  FiCreditCard,
  FiPieChart,
  FiPlus,
  FiMinus,
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiArrowUp,
  FiArrowDown,
  FiPlusCircle,
  FiMinusCircle,
} from "react-icons/fi";

const ExpenseEntry = ({
  members,
  addIndividualExpense,
  subtractIndividualExpense,
  addToTotalSharedExpense,
  subtractFromTotalSharedExpense,
  totalSharedExpense,
  mealRate,
  totalMeals,
}) => {
  const [expenseType, setExpenseType] = useState("individual");
  const [selectedMember, setSelectedMember] = useState(members[0]?.id || 1);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [totalExpenseAmount, setTotalExpenseAmount] = useState("");
  const [totalExpenseDescription, setTotalExpenseDescription] = useState("");
  const [transactionType, setTransactionType] = useState("add"); // add or subtract

  // Individual Expense Submit
  const handleIndividualSubmit = (e) => {
    e.preventDefault();

    if (!description.trim() || !amount || parseFloat(amount) <= 0) {
      toast.error("Please fill all fields correctly");
      return;
    }

    if (transactionType === "add") {
      addIndividualExpense(selectedMember, amount, description);
    } else {
      subtractIndividualExpense(selectedMember, amount, description);
    }

    setDescription("");
    setAmount("");
  };

  // Total Shared Expense Submit
  const handleTotalExpenseSubmit = (e) => {
    e.preventDefault();

    if (
      !totalExpenseDescription.trim() ||
      !totalExpenseAmount ||
      parseFloat(totalExpenseAmount) <= 0
    ) {
      toast.error("Please fill all fields correctly");
      return;
    }

    if (transactionType === "add") {
      addToTotalSharedExpense(totalExpenseAmount);
    } else {
      subtractFromTotalSharedExpense(totalExpenseAmount);
    }

    setTotalExpenseDescription("");
    setTotalExpenseAmount("");
  };

  // Calculate meal rate impact
  const newTotalSharedExpense =
    transactionType === "add"
      ? totalSharedExpense + parseFloat(totalExpenseAmount || 0)
      : totalSharedExpense - parseFloat(totalExpenseAmount || 0);

  const newMealRate = totalMeals > 0 ? newTotalSharedExpense / totalMeals : 0;
  const rateChange = newMealRate - mealRate;

  const totalIndividualExpense = members.reduce(
    (sum, m) => sum + m.totalIndividualExpense,
    0
  );
  const selectedMemberData = members.find((m) => m.id === selectedMember);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
            <FiDollarSign className="w-7 h-7 text-white" />
          </div>
          Expense Management
        </h1>
        <p className="text-gray-600 mt-2">
          Add or subtract expenses for individual members and total shared
          expense
        </p>
      </div>

      {/* Expense Type Tabs */}
      <div className="flex gap-3 mb-8 bg-white rounded-2xl p-2 border border-gray-200 shadow-sm">
        <button
          onClick={() => setExpenseType("individual")}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
            expenseType === "individual"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-50"
          }`}>
          <FiUser className="w-5 h-5" />
          Individual Expense
        </button>
        <button
          onClick={() => setExpenseType("total")}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
            expenseType === "total"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-50"
          }`}>
          <FiUsers className="w-5 h-5" />
          Total Shared Expense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Expense Forms */}
        <div className="lg:col-span-2">
          {/* Individual Expense Form */}
          {expenseType === "individual" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Individual Expense
                  </h3>
                  <p className="text-gray-500">
                    Add or subtract expense for a member
                  </p>
                </div>

                {/* Transaction Type Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setTransactionType("add")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      transactionType === "add"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}>
                    <FiPlusCircle className="w-4 h-4" />
                    Add
                  </button>
                  <button
                    onClick={() => setTransactionType("subtract")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      transactionType === "subtract"
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}>
                    <FiMinusCircle className="w-4 h-4" />
                    Subtract
                  </button>
                </div>
              </div>

              <form onSubmit={handleIndividualSubmit} className="space-y-6">
                {/* Member Selection */}
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Select Member
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {members.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => setSelectedMember(member.id)}
                        className={`p-4 rounded-xl border transition-all ${
                          selectedMember === member.id
                            ? transactionType === "add"
                              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-sm"
                              : "bg-gradient-to-r from-red-50 to-pink-50 border-red-300 shadow-sm"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}>
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              selectedMember === member.id
                                ? transactionType === "add"
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                  : "bg-gradient-to-r from-red-500 to-pink-500"
                                : member.hasPaid
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                : "bg-gradient-to-r from-gray-400 to-gray-500"
                            }`}>
                            {member.name.charAt(0)}
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-gray-800">
                              {member.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ৳{member.totalIndividualExpense}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description & Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">
                      Description
                    </label>
                    <div className="relative">
                      <FiFileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={
                          transactionType === "add"
                            ? "e.g., Chicken, Rice..."
                            : "e.g., Refund, Adjustment..."
                        }
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">
                      Amount (৳)
                    </label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Current Balance Warning for Subtract */}
                {transactionType === "subtract" && selectedMemberData && (
                  <div
                    className={`p-4 rounded-xl border ${
                      parseFloat(amount || 0) >
                      selectedMemberData.totalIndividualExpense
                        ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
                        : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                    }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">
                        Current Balance:
                      </span>
                      <span className="font-bold text-blue-600">
                        ৳{selectedMemberData.totalIndividualExpense}
                      </span>
                    </div>
                    {parseFloat(amount || 0) >
                      selectedMemberData.totalIndividualExpense && (
                      <p className="text-red-600 text-sm mt-2">
                        ⚠️ Cannot subtract more than current balance
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-3 ${
                    transactionType === "add"
                      ? "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white"
                      : "bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white"
                  }`}>
                  {transactionType === "add" ? (
                    <>
                      <FiPlus className="w-5 h-5" />
                      Add ৳{amount || 0} to{" "}
                      {members.find((m) => m.id === selectedMember)?.name}
                    </>
                  ) : (
                    <>
                      <FiMinus className="w-5 h-5" />
                      Subtract ৳{amount || 0} from{" "}
                      {members.find((m) => m.id === selectedMember)?.name}
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Total Shared Expense Form */}
          {expenseType === "total" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Total Shared Expense
                  </h3>
                  <p className="text-gray-500">
                    Add or subtract from total shared expense
                  </p>
                </div>

                {/* Transaction Type Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setTransactionType("add")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      transactionType === "add"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}>
                    <FiPlusCircle className="w-4 h-4" />
                    Add
                  </button>
                  <button
                    onClick={() => setTransactionType("subtract")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      transactionType === "subtract"
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}>
                    <FiMinusCircle className="w-4 h-4" />
                    Subtract
                  </button>
                </div>
              </div>

              <form onSubmit={handleTotalExpenseSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">
                      Description
                    </label>
                    <div className="relative">
                      <FiFileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={totalExpenseDescription}
                        onChange={(e) =>
                          setTotalExpenseDescription(e.target.value)
                        }
                        placeholder={
                          transactionType === "add"
                            ? "e.g., Monthly Total, Additional Fund..."
                            : "e.g., Refund, Expense Correction..."
                        }
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">
                      Amount (৳)
                    </label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={totalExpenseAmount}
                        onChange={(e) => setTotalExpenseAmount(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Impact Preview */}
                {totalExpenseAmount && (
                  <div
                    className={`p-6 rounded-2xl border ${
                      transactionType === "add"
                        ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
                        : "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
                    }`}>
                    <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <FiTrendingUp className="w-5 h-5" />
                      Impact on Meal Rate
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current Total:</span>
                        <span className="font-semibold">
                          ৳{totalSharedExpense}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {transactionType === "add"
                            ? "Addition"
                            : "Subtraction"}
                          :
                        </span>
                        <span
                          className={`font-semibold ${
                            transactionType === "add"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}>
                          {transactionType === "add" ? "+" : "-"}৳
                          {parseFloat(totalExpenseAmount || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">New Total:</span>
                        <span
                          className={`font-bold ${
                            transactionType === "add"
                              ? "text-purple-600"
                              : "text-red-600"
                          }`}>
                          ৳{newTotalSharedExpense.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <span className="text-gray-700 font-medium">
                          New Meal Rate:
                        </span>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            ৳{newMealRate.toFixed(2)}
                          </div>
                          <div
                            className={`text-sm flex items-center gap-1 ${
                              rateChange > 0
                                ? "text-red-500"
                                : rateChange < 0
                                ? "text-green-500"
                                : "text-gray-500"
                            }`}>
                            {rateChange > 0 ? (
                              <FiArrowUp className="w-4 h-4" />
                            ) : rateChange < 0 ? (
                              <FiArrowDown className="w-4 h-4" />
                            ) : null}
                            {rateChange > 0
                              ? `+৳${rateChange.toFixed(2)}`
                              : rateChange < 0
                              ? `-৳${Math.abs(rateChange).toFixed(2)}`
                              : "No change"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Balance Warning for Subtract */}
                {transactionType === "subtract" && (
                  <div
                    className={`p-4 rounded-xl border ${
                      parseFloat(totalExpenseAmount || 0) > totalSharedExpense
                        ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
                        : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                    }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">
                        Current Total:
                      </span>
                      <span className="font-bold text-purple-600">
                        ৳{totalSharedExpense}
                      </span>
                    </div>
                    {parseFloat(totalExpenseAmount || 0) >
                      totalSharedExpense && (
                      <p className="text-red-600 text-sm mt-2">
                        ⚠️ Cannot subtract more than current total
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-3 ${
                    transactionType === "add"
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                      : "bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white"
                  }`}>
                  {transactionType === "add" ? (
                    <>
                      <FiPlus className="w-5 h-5" />
                      Add to Total Shared Expense
                    </>
                  ) : (
                    <>
                      <FiMinus className="w-5 h-5" />
                      Subtract from Total Shared Expense
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-8">
          {/* Individual Expenses Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiUser className="text-blue-500" />
              Individual Expenses
            </h3>
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        member.hasPaid
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                          : "bg-gradient-to-r from-gray-400 to-gray-500"
                      }`}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {
                            member.individualExpenses.filter(
                              (e) => e.type === "add"
                            ).length
                          }{" "}
                          adds,
                          {
                            member.individualExpenses.filter(
                              (e) => e.type === "subtract"
                            ).length
                          }{" "}
                          subtracts
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">
                      ৳{member.totalIndividualExpense}
                    </div>
                    <div
                      className={`text-xs ${
                        member.balance >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                      {member.balance >= 0 ? "Advanced" : "Due"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Expense Summary */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiCreditCard className="text-purple-500" />
              Total Shared Expense
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  ৳{totalSharedExpense}
                </div>
                <p className="text-gray-500 text-sm mt-1">Current total</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Meal Rate:</span>
                  <span className="font-semibold">৳{mealRate?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Meals:</span>
                  <span className="font-semibold">{totalMeals}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-purple-200">
                <p className="text-xs text-gray-500">
                  Formula: Total Shared Expense ÷ Total Meals
                </p>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiPieChart className="text-green-500" />
              Recent Transactions
            </h3>
            <div className="space-y-3">
              {members.slice(0, 3).map((member) => {
                const recentExpense =
                  member.individualExpenses[
                    member.individualExpenses.length - 1
                  ];
                return recentExpense ? (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          recentExpense.type === "add"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : "bg-gradient-to-r from-red-500 to-pink-500"
                        }`}>
                        {recentExpense.type === "add" ? "+" : "-"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[120px]">
                          {recentExpense.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-bold ${
                          recentExpense.type === "add"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}>
                        {recentExpense.type === "add" ? "+" : "-"}৳
                        {recentExpense.amount}
                      </div>
                      <div className="text-xs text-gray-500">
                        {recentExpense.date}
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseEntry;
