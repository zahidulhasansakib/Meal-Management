import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FiCoffee,
  FiSun,
  FiMoon,
  FiSave,
  FiRefreshCw,
  FiCalendar,
  FiChevronRight,
  FiPlus,
  FiMinus,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

const MealEntry = ({
  members,
  setMembers,
  dailyMeals,
  setDailyMeals,
  onSaveMeals,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [mealInputs, setMealInputs] = useState({});
  const [activeMealType, setActiveMealType] = useState("all");
  const [editMode, setEditMode] = useState({}); // Track which members are in edit mode

  // Initialize edit mode
  useEffect(() => {
    const initialEditMode = {};
    members.forEach((member) => {
      const todayMeal = getMealForDate(member.id);
      if (todayMeal.lunch > 0 || todayMeal.dinner > 0) {
        initialEditMode[member.id] = true;
      }
    });
    setEditMode(initialEditMode);
  }, [selectedDate, members]);

  const handleMealChange = (memberId, mealType, value) => {
    const numValue = Math.max(-2, Math.min(2, parseInt(value) || 0));
    setMealInputs((prev) => ({
      ...prev,
      [`${memberId}_${mealType}`]: numValue,
    }));
  };

  const incrementMeal = (memberId, mealType) => {
    const currentValue = mealInputs[`${memberId}_${mealType}`] || 0;
    const newValue = currentValue < 2 ? currentValue + 1 : 2;
    setMealInputs((prev) => ({
      ...prev,
      [`${memberId}_${mealType}`]: newValue,
    }));
  };

  const decrementMeal = (memberId, mealType) => {
    const currentValue = mealInputs[`${memberId}_${mealType}`] || 0;
    const newValue = currentValue > -2 ? currentValue - 1 : -2;
    setMealInputs((prev) => ({
      ...prev,
      [`${memberId}_${mealType}`]: newValue,
    }));
  };

  const toggleEditMode = (memberId) => {
    setEditMode((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));

    // If turning off edit mode, reset inputs for that member
    if (editMode[memberId]) {
      setMealInputs((prev) => {
        const newInputs = { ...prev };
        delete newInputs[`${memberId}_lunch`];
        delete newInputs[`${memberId}_dinner`];
        return newInputs;
      });
    }
  };

  const saveMeals = () => {
    const newMeals = {};
    let totalNewMeals = 0;
    let totalNegativeMeals = 0;

    members.forEach((member) => {
      const lunch = mealInputs[`${member.id}_lunch`] || 0;
      const dinner = mealInputs[`${member.id}_dinner`] || 0;
      const total = lunch + dinner;

      if (total !== 0) {
        newMeals[member.id] = {
          lunch,
          dinner,
          meals: total,
          isCorrection: total < 0, // Mark if it's a correction
        };
        totalNewMeals += total;

        if (total < 0) {
          totalNegativeMeals += Math.abs(total);
        }
      }
    });

    if (Object.keys(newMeals).length === 0) {
      toast.error("Please enter at least one meal change");
      return;
    }

    // Check if we're trying to deduct more meals than member currently has
    let hasError = false;
    members.forEach((member) => {
      const memberMeal = newMeals[member.id];
      if (memberMeal && memberMeal.meals < 0) {
        const deduction = Math.abs(memberMeal.meals);
        if (member.totalMeals < deduction) {
          toast.error(
            `${member.name} has only ${member.totalMeals} meals, cannot deduct ${deduction} meals`
          );
          hasError = true;
        }
      }
    });

    if (hasError) return;

    // Call parent function to handle saving
    if (onSaveMeals) {
      onSaveMeals(selectedDate, newMeals);
    } else {
      // Fallback if parent doesn't provide onSaveMeals
      setDailyMeals((prev) => ({
        ...prev,
        [selectedDate]: newMeals,
      }));

      // Update members total meals locally
      setMembers((prevMembers) =>
        prevMembers.map((member) => {
          const memberMeal = newMeals[member.id];
          if (memberMeal) {
            return {
              ...member,
              totalMeals: Math.max(0, member.totalMeals + memberMeal.meals),
            };
          }
          return member;
        })
      );
    }

    // Reset inputs and edit mode
    setMealInputs({});
    setEditMode({});

    let message = `🍽️ Saved meal changes for ${selectedDate}`;
    if (totalNewMeals > 0) {
      message += ` (+${totalNewMeals} meals)`;
    }
    if (totalNegativeMeals > 0) {
      message += ` (-${totalNegativeMeals} meals corrected)`;
    }

    toast.success(message);
  };

  const quickSetAll = (lunchValue, dinnerValue) => {
    const defaultInputs = {};
    members.forEach((member) => {
      defaultInputs[`${member.id}_lunch`] = lunchValue;
      defaultInputs[`${member.id}_dinner`] = dinnerValue;
    });
    setMealInputs(defaultInputs);
    toast.success(`Set all to ${lunchValue} lunch, ${dinnerValue} dinner`);
  };

  const getMealForDate = (memberId) => {
    return (
      dailyMeals[selectedDate]?.[memberId] || { lunch: 0, dinner: 0, meals: 0 }
    );
  };

  const getTodayTotalMeals = () => {
    return Object.values(dailyMeals[selectedDate] || {}).reduce(
      (sum, m) => sum + m.meals,
      0
    );
  };

  const getInputTotalMeals = () => {
    return members.reduce((sum, member) => {
      const todayMeal = getMealForDate(member.id);
      const lunch =
        mealInputs[`${member.id}_lunch`] !== undefined
          ? mealInputs[`${member.id}_lunch`]
          : editMode[member.id]
          ? todayMeal.lunch
          : 0;
      const dinner =
        mealInputs[`${member.id}_dinner`] !== undefined
          ? mealInputs[`${member.id}_dinner`]
          : editMode[member.id]
          ? todayMeal.dinner
          : 0;
      return sum + lunch + dinner;
    }, 0);
  };

  // Filter members based on active meal type
  const filteredMembers = members.filter((member) => {
    if (activeMealType === "all") return true;

    const todayMeal = getMealForDate(member.id);
    const lunch =
      mealInputs[`${member.id}_lunch`] !== undefined
        ? mealInputs[`${member.id}_lunch`]
        : editMode[member.id]
        ? todayMeal.lunch
        : 0;
    const dinner =
      mealInputs[`${member.id}_dinner`] !== undefined
        ? mealInputs[`${member.id}_dinner`]
        : editMode[member.id]
        ? todayMeal.dinner
        : 0;

    if (activeMealType === "lunch") return lunch !== 0;
    if (activeMealType === "dinner") return dinner !== 0;
    return true;
  });

  const totalMealsToday = getTodayTotalMeals();
  const inputMealsToday = getInputTotalMeals();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg">
                <FiCoffee className="w-7 h-7 text-white" />
              </div>
              <span>Daily Meal Entry</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Add new meals or correct previous entries
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none bg-white shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <FiSun className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Lunch Changes</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {inputMealsToday}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <FiMoon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Dinner Changes
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {inputMealsToday}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <FiCoffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Net Change</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {inputMealsToday * 2}
                <span className="text-sm text-gray-500 font-normal ml-2">
                  meals
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
              <FiRefreshCw className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-amber-600 font-medium">New Total</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {members.reduce((sum, m) => sum + m.totalMeals, 0) +
                  inputMealsToday * 2}
                <span className="text-sm text-gray-500 font-normal ml-2">
                  meals
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="mb-8 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-700">Quick Actions:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => quickSetAll(1, 1)}
                className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-sm font-medium">
                Add 1+1 All
              </button>
              <button
                onClick={() => quickSetAll(-1, 0)}
                className="px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors text-sm font-medium">
                Remove 1 Lunch
              </button>
              <button
                onClick={() => quickSetAll(0, -1)}
                className="px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors text-sm font-medium">
                Remove 1 Dinner
              </button>
              <button
                onClick={() => setMealInputs({})}
                className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2">
                <FiRefreshCw className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Filter by:</span>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveMealType("all")}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeMealType === "all"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}>
                All
              </button>
              <button
                onClick={() => setActiveMealType("lunch")}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeMealType === "lunch"
                    ? "bg-white shadow-sm text-amber-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}>
                Lunch
              </button>
              <button
                onClick={() => setActiveMealType("dinner")}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeMealType === "dinner"
                    ? "bg-white shadow-sm text-purple-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}>
                Dinner
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <FiEdit2 className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-medium text-amber-800">
              How to correct meals:
            </h4>
            <p className="text-sm text-amber-700 mt-1">
              ১. কারো মিল ভুলে বেশি হয়ে গেলে, তার "Edit" বাটন ক্লিক করুন
              <br />
              ২. "-" বাটন চাপে মিল কমিয়ে ফেলুন (নেগেটিভ সংখ্যা দেখাবে)
              <br />
              ৩. "Save All Meals" চাপলে টোটাল মিল আপডেট হবে
            </p>
          </div>
        </div>
      </div>

      {/* Meal Entry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {filteredMembers.map((member) => {
          const todayMeal = getMealForDate(member.id);
          const isEditing = editMode[member.id] || false;

          const lunchValue =
            mealInputs[`${member.id}_lunch`] !== undefined
              ? mealInputs[`${member.id}_lunch`]
              : isEditing
              ? todayMeal.lunch
              : 0;

          const dinnerValue =
            mealInputs[`${member.id}_dinner`] !== undefined
              ? mealInputs[`${member.id}_dinner`]
              : isEditing
              ? todayMeal.dinner
              : 0;

          const totalValue = lunchValue + dinnerValue;
          const currentTotal = member.totalMeals;
          const newTotal = Math.max(0, currentTotal + totalValue);

          return (
            <div
              key={member.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all ${
                isEditing ? "border-amber-300 bg-amber-50" : "border-gray-200"
              }`}>
              {/* Member Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {member.name.charAt(0)}
                    </div>
                    {totalValue !== 0 && (
                      <div
                        className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ${
                          totalValue > 0 ? "bg-green-500" : "bg-red-500"
                        }`}>
                        {totalValue > 0 ? `+${totalValue}` : totalValue}
                      </div>
                    )}
                    {todayMeal.meals > 0 && !isEditing && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {todayMeal.meals}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{member.name}</h3>
                    <div className="text-sm text-gray-500">
                      Current: {currentTotal} meals
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {todayMeal.meals > 0 && (
                    <button
                      onClick={() => toggleEditMode(member.id)}
                      className={`p-2 rounded-lg flex items-center gap-1 text-sm ${
                        isEditing
                          ? "bg-amber-100 text-amber-700 border border-amber-300"
                          : "bg-blue-100 text-blue-700 border border-blue-300"
                      }`}>
                      {isEditing ? (
                        <>
                          <FiTrash2 className="w-3 h-3" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <FiEdit2 className="w-3 h-3" />
                          Edit
                        </>
                      )}
                    </button>
                  )}
                  <FiChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Meal Controls */}
              <div className="space-y-4">
                {/* Lunch Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiSun className="w-4 h-4 text-amber-500" />
                      <span className="font-medium text-gray-700">Lunch</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => decrementMeal(member.id, "lunch")}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isEditing && lunchValue === -2}>
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <input
                          type="number"
                          min="-2"
                          max="2"
                          value={lunchValue}
                          onChange={(e) =>
                            handleMealChange(member.id, "lunch", e.target.value)
                          }
                          className={`w-16 h-10 text-center border rounded-lg font-bold mx-2 focus:outline-none focus:ring-2 ${
                            lunchValue > 0
                              ? "text-green-600 border-green-300 focus:ring-green-200 focus:border-green-500"
                              : lunchValue < 0
                              ? "text-red-600 border-red-300 focus:ring-red-200 focus:border-red-500"
                              : "text-gray-800 border-gray-300 focus:ring-amber-200 focus:border-amber-500"
                          }`}
                        />
                      </div>
                      <button
                        onClick={() => incrementMeal(member.id, "lunch")}
                        className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 flex items-center justify-center text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isEditing && lunchValue === 2}>
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lunch Progress Bar */}
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        lunchValue > 0
                          ? "bg-gradient-to-r from-amber-400 to-orange-500"
                          : lunchValue < 0
                          ? "bg-gradient-to-r from-red-400 to-rose-500"
                          : "bg-gray-300"
                      }`}
                      style={{ width: `${(Math.abs(lunchValue) / 2) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Dinner Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiMoon className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-gray-700">Dinner</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => decrementMeal(member.id, "dinner")}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isEditing && dinnerValue === -2}>
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <input
                          type="number"
                          min="-2"
                          max="2"
                          value={dinnerValue}
                          onChange={(e) =>
                            handleMealChange(
                              member.id,
                              "dinner",
                              e.target.value
                            )
                          }
                          className={`w-16 h-10 text-center border rounded-lg font-bold mx-2 focus:outline-none focus:ring-2 ${
                            dinnerValue > 0
                              ? "text-green-600 border-green-300 focus:ring-green-200 focus:border-green-500"
                              : dinnerValue < 0
                              ? "text-red-600 border-red-300 focus:ring-red-200 focus:border-red-500"
                              : "text-gray-800 border-gray-300 focus:ring-purple-200 focus:border-purple-500"
                          }`}
                        />
                      </div>
                      <button
                        onClick={() => incrementMeal(member.id, "dinner")}
                        className="w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isEditing && dinnerValue === 2}>
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dinner Progress Bar */}
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        dinnerValue > 0
                          ? "bg-gradient-to-r from-purple-400 to-pink-500"
                          : dinnerValue < 0
                          ? "bg-gradient-to-r from-rose-400 to-pink-500"
                          : "bg-gray-300"
                      }`}
                      style={{ width: `${(Math.abs(dinnerValue) / 2) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Total Summary */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        Today's Change:
                      </span>
                      <span
                        className={`font-bold ${
                          totalValue > 0
                            ? "text-green-600"
                            : totalValue < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}>
                        {totalValue > 0 ? `+${totalValue}` : totalValue}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        Current Total:
                      </span>
                      <span className="font-bold text-blue-600">
                        {currentTotal}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-gray-700 font-medium">
                        New Total:
                      </span>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            totalValue > 0
                              ? "text-green-600"
                              : totalValue < 0
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}>
                          {newTotal}
                        </div>
                        <div className="text-xs text-gray-500">
                          {totalValue > 0
                            ? "After adding"
                            : totalValue < 0
                            ? "After deducting"
                            : "No change"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Ready to Save Meal Changes?
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>
                Net change today:{" "}
                <span
                  className={`font-bold ${
                    inputMealsToday * 2 > 0
                      ? "text-green-600"
                      : inputMealsToday * 2 < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}>
                  {inputMealsToday * 2 > 0
                    ? `+${inputMealsToday * 2}`
                    : inputMealsToday * 2}{" "}
                  meals
                </span>
              </p>
              <p>
                Current all-time total:{" "}
                <span className="font-bold text-blue-600">
                  {members.reduce((sum, m) => sum + m.totalMeals, 0)} meals
                </span>
              </p>
              <p>
                New all-time total:{" "}
                <span className="font-bold text-purple-600">
                  {members.reduce((sum, m) => sum + m.totalMeals, 0) +
                    inputMealsToday * 2}{" "}
                  meals
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                quickSetAll(1, 1);
                setTimeout(saveMeals, 300);
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg flex items-center justify-center gap-3">
              <FiRefreshCw className="w-5 h-5" />
              Add 1+1 All
            </button>

            <button
              onClick={saveMeals}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-3">
              <FiSave className="w-5 h-5" />
              Save All Changes
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">Positive Changes</div>
            <div className="text-2xl font-bold text-green-600">
              {
                members.filter((member) => {
                  const lunch = mealInputs[`${member.id}_lunch`] || 0;
                  const dinner = mealInputs[`${member.id}_dinner`] || 0;
                  return lunch > 0 || dinner > 0;
                }).length
              }
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">Negative Changes</div>
            <div className="text-2xl font-bold text-red-600">
              {
                members.filter((member) => {
                  const lunch = mealInputs[`${member.id}_lunch`] || 0;
                  const dinner = mealInputs[`${member.id}_dinner`] || 0;
                  return lunch < 0 || dinner < 0;
                }).length
              }
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">Total Adjustments</div>
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(mealInputs).length / 2}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealEntry;
