// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../api/axiosConfig';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';  
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Shield, Lock, CheckCircle, XCircle, Users, Edit3, Save, X } from 'lucide-react'


const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal", "Andaman & Nicobar Islands", "Chandigarh",
    "Dadra & Nagar Haveli & Daman & Diu", "Delhi", "Jammu & Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry"
];

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // State for editable fields - Initialize with user data
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', sex: '', dob: '',
    city: '', state: '', pincode: '',
    relationType: '', relativeName: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        sex: user.sex || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '', // Format for date input
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
        relationType: user.relative?.relationType || '',
        relativeName: user.relative?.relativeName || ''
      });
    }
  }, [user]); // Re-run when user object changes

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle saving the updated profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Saving profile...');

    // Structure data for the backend
    const profileUpdateData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      sex: formData.sex,
      dob: formData.dob,
      address: {
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      },
      relative: {
        relationType: formData.relationType,
        relativeName: formData.relativeName
      }
    };

    try {
      await updateUserProfile(profileUpdateData);
      toast.success('Profile updated successfully!', { id: toastId });
      setIsEditing(false); // Exit edit mode
      refreshProfile(); // Refresh user data in context
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to update profile.', { id: toastId });
      console.error('Profile update error:', err);
    }
  };

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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Profile Information
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-sm text-sky-400 hover:text-sky-300 transition-colors"
              >
                <Edit3 size={14} /> Edit
              </button>
            )}
          </div>

          {isEditing ? (
            /* --- EDIT FORM --- */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label>Full Name</label><input name="name" value={formData.name} onChange={handleInputChange} required className="input-style" /></div>
                <div><label>Phone Number</label><input name="phone" value={formData.phone} onChange={handleInputChange} required className="input-style" /></div>
                <div><label>Email Address</label><input name="email" type="email" value={formData.email} onChange={handleInputChange} className="input-style" /></div>
                <div><label>Sex</label><select name="sex" value={formData.sex} onChange={handleInputChange} required className="input-style"><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
                <div><label>Date of Birth</label><input name="dob" type="date" value={formData.dob} onChange={handleInputChange} required className="input-style" /></div>
                <div><label>City</label><input name="city" value={formData.city} onChange={handleInputChange} required className="input-style" /></div>
                <div><label>State</label><select name="state" value={formData.state} onChange={handleInputChange} required className="input-style"><option value="">Select</option>{indianStates.sort().map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label>Pincode</label><input name="pincode" value={formData.pincode} onChange={handleInputChange} required className="input-style" /></div>
                <div><label>Relation Type</label><select name="relationType" value={formData.relationType} onChange={handleInputChange} required className="input-style"><option value="">Select</option><option value="S/O">S/O</option><option value="W/O">W/O</option><option value="D/O">D/O</option></select></div>
                <div><label>Relative's Name</label><input name="relativeName" value={formData.relativeName} onChange={handleInputChange} required className="input-style" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          ) : (
            /* --- DISPLAY FIELDS --- */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ProfileField icon={CreditCard} label="Aadhar Number" value={user?.addharCardNumber || 'N/A'} />
              <ProfileField icon={User} label="Full Name" value={user?.name || 'N/A'} />
              <ProfileField icon={User} label="Sex" value={user?.sex || 'N/A'} />
              <ProfileField icon={Users} label="Relative" value={formattedRelative} />
              <ProfileField icon={Calendar} label="Date of Birth" value={user?.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'} />
              <ProfileField icon={Phone} label="Phone Number" value={user?.phone || 'N/A'} />
              <ProfileField icon={Mail} label="Email Address" value={user?.email || 'N/A'} />
              <ProfileField icon={MapPin} label="Address" value={formattedAddress} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}