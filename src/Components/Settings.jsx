import React, { useState } from "react";
import {
  FiSave,
  FiBell,
  FiUsers,
  FiDollarSign,
  FiShield,
} from "react-icons/fi";
import toast from "react-hot-toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoCalculate: true,
    defaultMealRate: 50,
    currency: "BDT",
    language: "en",
    backupFrequency: "daily",
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">⚙️ System Settings</h2>
        <p className="text-gray-600">Customize your meal management system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* General Settings */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Notification Settings */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <FiBell className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Notification Settings
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Daily Reminder</p>
                    <p className="text-sm text-gray-500">
                      Remind to enter meals daily
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.notifications}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: e.target.checked,
                        })
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">
                      Auto Calculation
                    </p>
                    <p className="text-sm text-gray-500">
                      Automatically calculate meal rates
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.autoCalculate}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          autoCalculate: e.target.checked,
                        })
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Financial Settings */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <FiDollarSign className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Financial Settings
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Default Meal Rate (৳)
                  </label>
                  <input
                    type="number"
                    value={settings.defaultMealRate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        defaultMealRate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) =>
                      setSettings({ ...settings, currency: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="BDT">Bangladeshi Taka (৳)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiUsers className="w-6 h-6 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Hostel Info
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-600 font-medium">📍 Location</p>
                <p className="text-gray-800">Dhaka Student Hostel</p>
              </div>

              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-green-600 font-medium">
                  👥 Total Members
                </p>
                <p className="text-2xl font-bold text-gray-800">8 Students</p>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl">
                <p className="text-sm text-amber-600 font-medium">
                  🍽️ Meals Per Day
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  2 (Lunch + Dinner)
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-purple-600 font-medium">
                  📅 System Since
                </p>
                <p className="text-gray-800">January 2024</p>
              </div>
            </div>
          </div>

          {/* Backup Settings */}
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiShield className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-semibold text-gray-800">Backup</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Backup Frequency
                </label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      backupFrequency: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg">
          <FiSave className="w-5 h-5" />
          Save All Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
