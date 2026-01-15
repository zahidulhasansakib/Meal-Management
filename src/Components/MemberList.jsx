import React from "react";
import {
  FiCoffee,
  FiDollarSign,
  FiTrendingUp,
  FiCreditCard,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiCalendar,
  FiPlus,
  FiMinus,
  FiUsers,
} from "react-icons/fi";

// Import local images
import sakibImage from "../assets/sakib.jpg";
import shopnilImage from "../assets/shopnil.jpeg";
import diptoImage from "../assets/dipto.jpeg";
import injamImage from "../assets/injam.jpeg";
import hasanImage from "../assets/hasan.jpeg";
import nadimImage from "../assets/nadim.jpeg";
import samirImage from "../assets/samir.jpeg";
import faharImage from "../assets/fahar.jpeg";
import irfanImage from "../assets/irfan.jpeg";

const MemberList = ({ members, mealRate }) => {
  // Paid amounts for each member
  const paidAmounts = {
    sakib: 2425,
    shopnil: 2500,
    dipto: 200,
    injam: 2000,
    hasan: 0,
    nadim: 1000,
    samir: 1500,
  };

  // Member image mapping
  const memberImages = {
    sakib: sakibImage,
    shopnil: shopnilImage,
    dipto: diptoImage,
    injam: injamImage,
    hasan: hasanImage,
    nadim: nadimImage,
    samir: samirImage,
    fahar: faharImage,
    irfan: irfanImage,
  };

  // Get member image with fallback
  const getMemberImage = (memberName) => {
    const lowercaseName = memberName.toLowerCase();
    return memberImages[lowercaseName] || null;
  };

  // Calculate detailed balance with paid amounts
  const calculateDetails = (member) => {
    const mealCost = member.totalMeals * mealRate;
    const paid = paidAmounts[member.name.toLowerCase()] || 0;
    const balance = paid - mealCost;
    const status = balance >= 0 ? "advanced" : "due";
    const percentagePaid =
      paid > 0 ? Math.min(100, (paid / (paid + Math.abs(balance))) * 100) : 0;

    return {
      mealCost: mealCost.toFixed(2),
      paid: paid.toFixed(2),
      balance: Math.abs(balance).toFixed(2),
      originalBalance: balance,
      status,
      statusColor: balance >= 0 ? "text-emerald-600" : "text-rose-600",
      statusBg: balance >= 0 ? "bg-emerald-50" : "bg-rose-50",
      statusBorder: balance >= 0 ? "border-emerald-200" : "border-rose-200",
      icon:
        balance >= 0 ? (
          <FiCheckCircle className="w-4 h-4" />
        ) : (
          <FiAlertCircle className="w-4 h-4" />
        ),
      percentagePaid,
    };
  };

  // Calculate overall stats using paid amounts
  const totalPaid = Object.values(paidAmounts).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const totalMealCost = members.reduce(
    (sum, m) => sum + m.totalMeals * mealRate,
    0
  );
  const totalBalance = totalPaid - totalMealCost;
  const advancedMembers = members.filter(
    (m) => (paidAmounts[m.name.toLowerCase()] || 0) > m.totalMeals * mealRate
  );
  const dueMembers = members.filter(
    (m) => (paidAmounts[m.name.toLowerCase()] || 0) < m.totalMeals * mealRate
  );

  // Ex-Members Data with local images
  const exMembers = [
    {
      id: "ex-1",
      name: "Fahad",
      image: faharImage,
      lastActive: "3 months ago",
      contribution: "৳15,200",
      meals: "420",
      status: "Inactive",
    },
    {
      id: "ex-2",
      name: "Irfan",
      image: irfanImage,
      lastActive: "2 months ago",
      contribution: "৳12,800",
      meals: "385",
      status: "Inactive",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
                <FiUsers className="w-7 h-7 text-white" />
              </div>
              <span>Member Balances</span>
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Individual expense tracking and financial overview
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 shadow-sm">
              <div className="text-sm text-blue-600 font-medium">
                Current Meal Rate
              </div>
              <div className="text-2xl font-bold text-gray-800">
                ৳{mealRate}/meal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Paid</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                ৳{totalPaid.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <FiCreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">
                Total Meal Cost
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                ৳{totalMealCost.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl">
              <FiCoffee className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">Net Balance</p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  totalBalance >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}>
                {totalBalance >= 0 ? "+" : ""}৳
                {Math.abs(totalBalance).toFixed(2)}
              </p>
            </div>
            <div
              className={`p-3 rounded-xl ${
                totalBalance >= 0
                  ? "bg-gradient-to-br from-emerald-500 to-green-500"
                  : "bg-gradient-to-br from-rose-500 to-red-500"
              }`}>
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Members Status
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="text-center">
                  <div className="text-xl font-bold text-emerald-600">
                    {advancedMembers.length}
                  </div>
                  <div className="text-xs text-emerald-500">Advanced</div>
                </div>
                <div className="text-gray-300">|</div>
                <div className="text-center">
                  <div className="text-xl font-bold text-rose-600">
                    {dueMembers.length}
                  </div>
                  <div className="text-xs text-rose-500">Due</div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <FiUser className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {members.map((member) => {
          const details = calculateDetails(member);
          const isAdvanced = details.originalBalance >= 0;
          const memberImage = getMemberImage(member.name);

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Member Header with Larger Image */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  {/* Larger Profile Image */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-4xl overflow-hidden border-4 border-white shadow-xl">
                    {memberImage ? (
                      <img
                        src={memberImage}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.textContent =
                            member.name.charAt(0);
                        }}
                      />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-lg ${
                      isAdvanced ? "bg-emerald-500" : "bg-rose-500"
                    }`}>
                    {isAdvanced ? (
                      <FiCheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <FiAlertCircle className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-bold text-gray-800 text-xl mb-1">
                    {member.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                      Member ID: {member.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Payment Progress</span>
                  <span className="font-semibold">
                    {details.percentagePaid.toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isAdvanced
                        ? "bg-gradient-to-r from-emerald-400 to-green-500"
                        : "bg-gradient-to-r from-rose-400 to-red-500"
                    }`}
                    style={{ width: `${details.percentagePaid}%` }}
                  />
                </div>
              </div>

              {/* Financial Stats */}
              <div className="space-y-4">
                {/* Meals */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FiCoffee className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Meals</p>
                      <p className="text-lg font-bold text-gray-800">
                        {member.totalMeals}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Cost</p>
                    <p className="text-lg font-bold text-blue-600">
                      ৳{details.mealCost}
                    </p>
                  </div>
                </div>

                {/* Expense Paid */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FiCreditCard className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Paid Amount</p>
                      <p className="text-lg font-bold text-gray-800">
                        ৳{details.paid}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Balance */}
                <div
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    isAdvanced
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-rose-50 border-rose-200"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isAdvanced ? "bg-emerald-100" : "bg-rose-100"
                      }`}>
                      <FiTrendingUp
                        className={`w-5 h-5 ${
                          isAdvanced ? "text-emerald-500" : "text-rose-500"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Balance</p>
                      <p
                        className={`text-xl font-bold ${
                          isAdvanced ? "text-emerald-600" : "text-rose-600"
                        }`}>
                        {isAdvanced ? "+" : "-"}৳{details.balance}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isAdvanced
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}>
                    {isAdvanced ? "Advanced" : "Due"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ex-Members Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Ex-Members</h2>
            <p className="text-gray-600">
              Former members who contributed to the mess
            </p>
          </div>
          <div className="px-4 py-2 bg-gray-100 rounded-lg">
            <span className="text-sm text-gray-600">Total: 2 members</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                {/* Larger Image for Ex-Members */}
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-3xl overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.textContent =
                          member.name.charAt(0);
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white bg-gray-500 shadow-lg">
                    <FiUser className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {member.name}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        Last active: {member.lastActive}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                      {member.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
                      <p className="text-xs text-blue-600 font-medium">
                        Total Contribution
                      </p>
                      <p className="text-lg font-bold text-gray-800 mt-1">
                        {member.contribution}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3">
                      <p className="text-xs text-green-600 font-medium">
                        Meals Taken
                      </p>
                      <p className="text-lg font-bold text-gray-800 mt-1">
                        {member.meals}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiCalendar className="w-4 h-4" />
                      <span>Contributed for 8 months</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Balance Overview Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8 shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-xl font-bold text-gray-800">
            Detailed Balance Overview
          </h3>
          <p className="text-gray-600">
            Complete financial breakdown for all members
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                  Member
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                  Meals
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                  Meal Cost
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                  Paid Amount
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                  Balance
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member) => {
                const details = calculateDetails(member);
                const isAdvanced = details.originalBalance >= 0;
                const memberImage = getMemberImage(member.name);

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                          {memberImage ? (
                            <img
                              src={memberImage}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentElement.textContent =
                                  member.name.charAt(0);
                              }}
                            />
                          ) : (
                            member.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {member.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">
                          {member.totalMeals}
                        </div>
                        <div className="text-xs text-gray-500">
                          @৳{mealRate}/meal
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-lg font-bold text-blue-600">
                        ৳{details.mealCost}
                      </div>
                      <div className="text-xs text-gray-500">
                        {member.totalMeals} × {mealRate}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-lg font-bold text-emerald-600">
                        ৳{details.paid}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div
                        className={`text-lg font-bold ${
                          isAdvanced ? "text-emerald-600" : "text-rose-600"
                        }`}>
                        {isAdvanced ? "+" : "-"}৳{details.balance}
                      </div>
                      <div className="text-xs text-gray-500">
                        {isAdvanced ? "Advanced" : "Due"} Amount
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                          isAdvanced
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-rose-100 text-rose-700 border border-rose-200"
                        }`}>
                        {isAdvanced ? (
                          <FiCheckCircle className="w-4 h-4" />
                        ) : (
                          <FiAlertCircle className="w-4 h-4" />
                        )}
                        {isAdvanced ? "Advanced" : "Due"}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="py-4 px-6 font-bold text-gray-800">TOTAL</td>
                <td className="py-4 px-6">
                  <div className="text-lg font-bold text-gray-800">
                    {members.reduce((sum, m) => sum + m.totalMeals, 0)}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-lg font-bold text-blue-600">
                    ৳{totalMealCost.toFixed(2)}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-lg font-bold text-emerald-600">
                    ৳{totalPaid.toFixed(2)}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div
                    className={`text-lg font-bold ${
                      totalBalance >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}>
                    {totalBalance >= 0 ? "+" : ""}৳
                    {Math.abs(totalBalance).toFixed(2)}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div
                    className={`text-sm font-medium ${
                      totalBalance >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}>
                    {totalBalance >= 0 ? "Overall Advanced" : "Overall Due"}
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Paid Amounts Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Paid Amounts Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Object.entries(paidAmounts).map(([name, amount]) => (
            <div
              key={name}
              className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-sm font-medium text-gray-600 capitalize mb-1">
                {name}
              </div>
              <div className="text-lg font-bold text-emerald-600">
                ৳{amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-500"></div>
          <div>
            <div className="font-medium text-gray-800">Advanced Balance</div>
            <div className="text-sm text-gray-600">
              Paid amount is more than meal cost
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-rose-400 to-red-500"></div>
          <div>
            <div className="font-medium text-gray-800">Due Balance</div>
            <div className="text-sm text-gray-600">Need to pay more</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500"></div>
          <div>
            <div className="font-medium text-gray-800">Meal Cost</div>
            <div className="text-sm text-gray-600">
              Meal Cost = Total Meals × ৳{mealRate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
