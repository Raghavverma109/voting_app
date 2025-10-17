// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Shield, Lock, CheckCircle, XCircle, Users } from 'lucide-react'; // Added Users icon

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const changePw = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile/password', { currentPassword: oldPass, newPassword: newPass });
      toast.success('Password changed ✅');
      setOldPass(''); setNewPass('');
      refreshProfile();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Change failed');
    }
  };

  const ProfileField = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
      <div className="mt-0.5">
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-white break-words">{value}</p>
      </div>
    </div>
  );

  // ✅ FIX: Pre-format the nested objects into readable strings
  const formattedAddress = user?.address
    ? `${user.address.city}, ${user.address.state} - ${user.address.pincode}`
    : 'N/A';

  const formattedRelative = user?.relative
    ? `${user.relative.relationType} ${user.relative.relativeName}` // e.g., "S/O Anil Verma"
    : 'N/A';

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Profile Header */}
        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
          <div className="flex items-center gap-4">
            {/* ✅ FIX: Corrected Tailwind class from w-30 h-30 to w-28 h-28 */}
            <div className="w-28 h-28 rounded-full bg-emerald-900/30 flex items-center justify-center border-2 border-emerald-800 overflow-hidden">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-emerald-400" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name || 'User Profile'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs font-medium rounded-full">
                  {user?.role || 'Voter'}
                </span>
                {user?.isVerified ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle className="w-3.5 h-3.5" /> Verified</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-slate-400"><XCircle className="w-3.5 h-3.5" /> Not Verified</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Profile Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ProfileField icon={CreditCard} label="Aadhar Number" value={user?.addharCardNumber || 'N/A'} />
            <ProfileField icon={User} label="Full Name" value={user?.name || 'N/A'} />

            {/* ✅ ADDED: Display for Sex */}
            <ProfileField icon={User} label="Sex" value={user?.sex || 'N/A'} />

            {/* ✅ ADDED: Display for Relative */}
            <ProfileField icon={Users} label="Relative" value={formattedRelative} />

            <ProfileField icon={Calendar} label="Date of Birth" value={user?.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'} />
            <ProfileField icon={Phone} label="Phone Number" value={user?.phone || 'N/A'} />
            <ProfileField icon={Mail} label="Email Address" value={user?.email || 'N/A'} />

            {/* ✅ FIX: Use the formattedAddress string */}
            <ProfileField icon={MapPin} label="Address" value={formattedAddress} />
          </div>
        </div>

        {/* Change Password Card */}

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">

          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">

            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />

            Change Password

          </h3>
          <form onSubmit={changePw} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Current Password
              </label>
              <input
                type="password" value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}