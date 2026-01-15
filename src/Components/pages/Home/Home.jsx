import React, { useState, useEffect, useCallback } from "react";
import Dashboard from "../../Dashboard";
import MealEntry from "../../MealEntry";
import ExpenseEntry from "../../ExpenseEntry";
import MemberList from "../../MemberList";
import Statistics from "../../Statistics";
import Settings from "../../Settings";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiPieChart,
  FiSettings,
  FiCoffee,
  FiShoppingCart,
  FiCheckCircle,
  FiXCircle,
  FiSave,
  FiDownload,
  FiTrendingUp,
  FiUser,
  FiPlus,
  FiMinus,
  FiRefreshCw,
} from "react-icons/fi";
import toast from "react-hot-toast";

const Home = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Initial members data
  const initialMembers = [
    {
      id: 1,
      name: "Injam",
      totalMeals: 16,
      totalIndividualExpense: 1500,
      individualExpenses: [
        {
          id: 1,
          date: "14-01-2026",
          amount: 1500,
          description: "Bazar",
          type: "add",
        },
      ],
      hasPaid: true,
    },
    {
      id: 2,
      name: "Hasan",
      totalMeals: 16,
      totalIndividualExpense: 0,
      individualExpenses: [],
      hasPaid: false,
    },
    {
      id: 3,
      name: "Nadim",
      totalMeals: 15,
      totalIndividualExpense: 1000,
      individualExpenses: [
        {
          id: 2,
          date: "14-01-2026",
          amount: 1000,
          description: "Bazar",
          type: "add",
        },
      ],
      hasPaid: true,
    },
    {
      id: 4,
      name: "Sakib",
      totalMeals: 24,
      totalIndividualExpense: 2425,
      individualExpenses: [
        {
          id: 3,
          date: "14-01-2026",
          amount: 2425,
          description: "Bazar",
          type: "add",
        },
      ],
      hasPaid: true,
    },
    {
      id: 5,
      name: "Shopnil",
      totalMeals: 15,
      totalIndividualExpense: 2500,
      individualExpenses: [
        {
          id: 4,
          date: "14-01-2026",
          amount: 2500,
          description: "Bazar",
          type: "add",
        },
      ],
      hasPaid: true,
    },
    {
      id: 6,
      name: "Dipto",
      totalMeals: 18,
      totalIndividualExpense: 200,
      individualExpenses: [
        {
          id: 5,
          date: "14-01-2026",
          amount: 200,
          description: "Bazar",
          type: "add",
        },
      ],
      hasPaid: true,
    },
    {
      id: 7,
      name: "Samir",
      totalMeals: 12,
      totalIndividualExpense: 1500,
      individualExpenses: [
        {
          id: 6,
          date: "14-01-2026",
          amount: 1500,
          description: "Bazar",
          type: "add",
        },
      ],
      hasPaid: true,
    },
    {
      id: 8,
      name: "Farhan",
      totalMeals: 0,
      totalIndividualExpense: 0,
      individualExpenses: [],
      hasPaid: false,
    },
  ];

  // Load data from localStorage
  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  };

  // Save data to localStorage
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  // State declarations
  const [members, setMembers] = useState(() =>
    loadFromLocalStorage("mealManager_members", initialMembers)
  );
  const [dailyMeals, setDailyMeals] = useState(() =>
    loadFromLocalStorage("mealManager_dailyMeals", {})
  );

  // Total Shared Expense state - SHARED EXPENSE
  const [totalSharedExpense, setTotalSharedExpense] = useState(() =>
    loadFromLocalStorage("mealManager_totalSharedExpense", 9135)
  );

  // Calculate derived states
  const totalIndividualExpense = members.reduce(
    (sum, m) => sum + m.totalIndividualExpense,
    0
  );
  const totalMeals = members.reduce((sum, m) => sum + m.totalMeals, 0);

  // Meal rate calculation - REAL-TIME
  const mealRate = totalMeals > 0 ? totalSharedExpense / totalMeals : 0;

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage("mealManager_members", members);
  }, [members]);

  useEffect(() => {
    saveToLocalStorage("mealManager_dailyMeals", dailyMeals);
  }, [dailyMeals]);

  useEffect(() => {
    saveToLocalStorage("mealManager_totalSharedExpense", totalSharedExpense);
  }, [totalSharedExpense]);

  // Calculate balances whenever mealRate changes
  useEffect(() => {
    const updatedMembers = members.map((member) => {
      const mealCost = member.totalMeals * mealRate;
      const balance = member.totalIndividualExpense - mealCost;

      return {
        ...member,
        mealCost: parseFloat(mealCost.toFixed(2)),
        balance: parseFloat(balance.toFixed(2)),
      };
    });

    // Only update if there are changes
    if (JSON.stringify(updatedMembers) !== JSON.stringify(members)) {
      setMembers(updatedMembers);
    }
  }, [mealRate, totalSharedExpense, totalMeals]);

  // Update timestamp whenever expense changes
  const updateTimestamp = () => {
    setLastUpdated(new Date());
  };

  // Function to add individual expense (increase) - UPDATED: Now also adds to totalSharedExpense
  const addIndividualExpense = useCallback(
    (memberId, amount, description) => {
      const amountNum = parseFloat(amount);

      // Update member's individual expense
      setMembers((prev) => {
        const updatedMembers = prev.map((member) => {
          if (member.id === memberId) {
            const newExpense = {
              id: Date.now(),
              date: new Date().toLocaleDateString("en-BD"),
              amount: amountNum,
              description,
              type: "add",
            };
            return {
              ...member,
              totalIndividualExpense: member.totalIndividualExpense + amountNum,
              individualExpenses: [...member.individualExpenses, newExpense],
              hasPaid: true,
            };
          }
          return member;
        });
        return updatedMembers;
      });

      // ALSO ADD TO TOTAL SHARED EXPENSE
      setTotalSharedExpense((prev) => {
        const newTotal = prev + amountNum;
        return newTotal;
      });

      updateTimestamp();
      toast.success(
        `৳${amount} added for ${
          members.find((m) => m.id === memberId)?.name
        }. Total Expense: ৳${totalSharedExpense + amountNum}`
      );
    },
    [members, totalSharedExpense]
  );

  // Function to subtract individual expense (decrease) - UPDATED: Now also subtracts from totalSharedExpense
  const subtractIndividualExpense = useCallback(
    (memberId, amount, description) => {
      const amountNum = parseFloat(amount);
      const member = members.find((m) => m.id === memberId);

      if (!member) {
        toast.error("Member not found");
        return;
      }

      // Check if member has enough balance to subtract
      if (member.totalIndividualExpense < amountNum) {
        toast.error(
          `${member.name} doesn't have enough balance to subtract ৳${amount}`
        );
        return;
      }

      // Update member's individual expense
      setMembers((prev) => {
        const updatedMembers = prev.map((member) => {
          if (member.id === memberId) {
            const newExpense = {
              id: Date.now(),
              date: new Date().toLocaleDateString("en-BD"),
              amount: amountNum,
              description,
              type: "subtract",
            };
            const newTotal = member.totalIndividualExpense - amountNum;
            return {
              ...member,
              totalIndividualExpense: newTotal,
              individualExpenses: [...member.individualExpenses, newExpense],
              hasPaid: newTotal > 0,
            };
          }
          return member;
        });
        return updatedMembers;
      });

      // ALSO SUBTRACT FROM TOTAL SHARED EXPENSE
      setTotalSharedExpense((prev) => {
        const newTotal = prev - amountNum;
        return newTotal;
      });

      updateTimestamp();
      toast.success(
        `৳${amount} subtracted from ${member.name}. Total Expense: ৳${
          totalSharedExpense - amountNum
        }`
      );
    },
    [members, totalSharedExpense]
  );

  // Function to add to total shared expense (increase) - DIRECT ADD
  const addToTotalSharedExpense = useCallback((amount) => {
    const amountNum = parseFloat(amount);
    setTotalSharedExpense((prev) => {
      const newTotal = prev + amountNum;
      toast.success(
        `৳${amount} added to Total Shared Expense. New total: ৳${newTotal}`
      );
      return newTotal;
    });
    updateTimestamp();
  }, []);

  // Function to subtract from total shared expense (decrease) - DIRECT SUBTRACT
  const subtractFromTotalSharedExpense = useCallback((amount) => {
    const amountNum = parseFloat(amount);
    setTotalSharedExpense((prev) => {
      if (prev < amountNum) {
        toast.error(
          `Cannot subtract ৳${amount}. Current total is only ৳${prev}`
        );
        return prev;
      }
      const newTotal = prev - amountNum;
      toast.success(
        `৳${amount} subtracted from Total Shared Expense. New total: ৳${newTotal}`
      );
      return newTotal;
    });
    updateTimestamp();
  }, []);

  // Function to handle daily meal save
  const handleDailyMealSave = useCallback((date, mealData) => {
    setDailyMeals((prev) => {
      const updatedDailyMeals = {
        ...prev,
        [date]: mealData,
      };
      return updatedDailyMeals;
    });

    // Update members total meals
    Object.entries(mealData).forEach(([memberIdStr, mealInfo]) => {
      const memberId = parseInt(memberIdStr);
      const additionalMeals = mealInfo.meals;

      setMembers((prev) =>
        prev.map((member) => {
          if (member.id === memberId) {
            return {
              ...member,
              totalMeals: member.totalMeals + additionalMeals,
            };
          }
          return member;
        })
      );
    });

    updateTimestamp();
    toast.success(
      `🍽️ ${Object.values(mealData).reduce(
        (sum, m) => sum + m.meals,
        0
      )} meals saved for ${date}`
    );
  }, []);

  // Format last updated time
  const formattedTime = lastUpdated.toLocaleTimeString("en-BD", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Calculate current total
  const currentTotalExpense = totalSharedExpense;

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: <FiHome /> },
    { id: "meal", name: "Meal Entry", icon: <FiCoffee /> },
    { id: "expense", name: "Expense", icon: <FiShoppingCart /> },
    { id: "members", name: "Members", icon: <FiUsers /> },
    { id: "stats", name: "Statistics", icon: <FiPieChart /> },
    { id: "settings", name: "Settings", icon: <FiSettings /> },
  ];

  // Calculate statistics
  const paidMembersCount = members.filter((m) => m.hasPaid).length;
  const unpaidMembersCount = members.filter((m) => !m.hasPaid).length;
  const totalAdvanced = members
    .filter((m) => m.balance > 0)
    .reduce((sum, m) => sum + m.balance, 0);
  const totalDue = Math.abs(
    members.filter((m) => m.balance < 0).reduce((sum, m) => sum + m.balance, 0)
  );
  const totalTransactions = members.reduce(
    (sum, m) => sum + m.individualExpenses.length,
    0
  );

  return (
    <div className="min-h-screen">
      {/* Header - REAL-TIME UPDATES */}
      <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold">
                🍽️ Sakib Mamar Meal Management System
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-blue-100">
                  Individual expense → Total Expense auto updates • Real-time
                </p>
                <div className="flex items-center gap-1 text-blue-200 text-sm">
                  <FiRefreshCw className="w-3 h-3" />
                  <span>Updated: {formattedTime}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-2xl font-bold">
                  ৳{currentTotalExpense.toLocaleString()}
                </div>
                <div className="text-xs text-blue-200">Total Expense</div>
                <div className="text-xs text-blue-300 mt-1">
                  Auto-updates when you add/subtract
                </div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-2xl font-bold">৳{mealRate.toFixed(2)}</div>
                <div className="text-xs text-blue-200">Meal Rate</div>
                <div className="text-xs text-blue-300 mt-1">
                  ৳{currentTotalExpense} ÷ {totalMeals} meals
                </div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-2xl font-bold">{totalMeals}</div>
                <div className="text-xs text-blue-200">Total Meals</div>
                <div className="text-xs text-blue-300 mt-1">
                  {members.length} members
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-xl p-2 shadow-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              {tab.icon}
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {activeTab === "dashboard" && (
            <Dashboard
              members={members}
              totalSharedExpense={currentTotalExpense}
              mealRate={mealRate.toFixed(2)}
              totalIndividualExpense={totalIndividualExpense}
              totalMeals={totalMeals}
            />
          )}

          {activeTab === "meal" && (
            <MealEntry
              members={members}
              setMembers={setMembers}
              dailyMeals={dailyMeals}
              setDailyMeals={setDailyMeals}
              onSaveMeals={handleDailyMealSave}
            />
          )}

          {activeTab === "expense" && (
            <ExpenseEntry
              members={members}
              addIndividualExpense={addIndividualExpense}
              subtractIndividualExpense={subtractIndividualExpense}
              addToTotalSharedExpense={addToTotalSharedExpense}
              subtractFromTotalSharedExpense={subtractFromTotalSharedExpense}
              totalSharedExpense={currentTotalExpense}
              mealRate={mealRate}
              totalMeals={totalMeals}
            />
          )}

          {activeTab === "members" && (
            <MemberList
              members={members}
              mealRate={mealRate}
              totalSharedExpense={currentTotalExpense}
            />
          )}

          {activeTab === "stats" && (
            <Statistics
              members={members}
              totalSharedExpense={currentTotalExpense}
              dailyMeals={dailyMeals}
              mealRate={mealRate}
              totalIndividualExpense={totalIndividualExpense}
            />
          )}

          {activeTab === "settings" && <Settings />}
        </div>

        {/* Auto Update Info */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            ⚡ Automatic Update System
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">
                    Step 1: Add/Subtract Expense
                  </h4>
                  <p className="text-xs text-gray-500">
                    Individual member expense
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                When you add or subtract from a member, it automatically updates
                Total Expense
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <FiDollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">
                    Step 2: Total Expense Updates
                  </h4>
                  <p className="text-xs text-gray-500">Auto calculation</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Total Expense = Previous Total ± Individual Expense changes
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <FiTrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">
                    Step 3: Meal Rate Recalculates
                  </h4>
                  <p className="text-xs text-gray-500">Real-time update</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                New Meal Rate = Updated Total Expense ÷ Total Meals
              </p>
            </div>
          </div>

          {/* Current Status */}
          <div className="p-4 bg-blue-100 rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-blue-700 mb-2">
                  📊 Current Status
                </h4>
                <p className="text-blue-600 text-sm">
                  Expense add/subtract → Total Expense updates → Meal Rate
                  recalculates → Header updates
                </p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  Total Expense: ৳{currentTotalExpense}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Meal Rate: ৳{mealRate.toFixed(2)} per meal
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 shadow-2xl border border-gray-800">
            {/* Floating orbs */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Main grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
                      <span className="text-white text-xl">🍽️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      MessMate Management System
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    A comprehensive solution for student hostel meal management
                    with real-time expense tracking, automated calculations, and
                    detailed analytics for efficient financial management.
                  </p>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800">
                  <div className="text-gray-400 text-sm mb-3">
                    System Status
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Members Online</span>
                      <span className="text-emerald-400 font-medium">
                        {members.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Active Sessions</span>
                      <span className="text-blue-400 font-medium">
                        {paidMembersCount + unpaidMembersCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Last Activity</span>
                      <span className="text-amber-400 font-medium">
                        {formattedTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="px-4 py-2 bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-full border border-blue-800">
                  <span className="text-blue-300 font-medium">
                    📍 Dhaka Student Hostel
                  </span>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 rounded-full border border-emerald-800">
                  <span className="text-emerald-300 font-medium">
                    ৳{currentTotalExpense.toLocaleString()} Total
                  </span>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-purple-900/30 to-purple-800/30 rounded-full border border-purple-800">
                  <span className="text-purple-300 font-medium">
                    {paidMembersCount} Paid • {unpaidMembersCount} Due
                  </span>
                </div>
              </div>

              {/* Creator info */}
              <div className="pt-6 border-t border-gray-800">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold">ZS</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        Project by{" "}
                        <span className="text-cyan-400">
                          Md Zahidul Hasan Sakib
                        </span>
                      </p>
                      <p className="text-gray-400 text-sm">
                        Full Stack Developer • UI/UX Designer • System Architect
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-gray-400 text-sm mb-1">
                      MessMate™ v2.5.1
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="text-green-400 text-sm font-medium">
                        Live & Operational
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
