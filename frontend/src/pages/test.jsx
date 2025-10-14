// src/pages/Signup.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AadharScanner from "../components/AadharScanner";
// import { parseAadhaarXml } from "../utils/parseAadhaarXml";
// import { compareAadhaarWithManual } from "../utils/matchAadhaar";

import { parseAadhaarXml } from "../utils/parseAadhaarXml";
import { compareAadhaarWithManual } from "../utils/matchAadhaar";
import { QrReader } from "react-qr-reader";


import api from "../api/axiosConfig";
import toast from "react-hot-toast";
import {
  User, Lock, Phone, MapPin, Calendar,
  ShieldCheck, ArrowRight, Camera
} from 'lucide-react';


export default function Signup() {
  const [aadhar, setAadhar] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState(null); // this will store Cloudinary secure_url\


  // photo states
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { signup } = useAuth();
  const nav = useNavigate();


  const [scanData, setScanData] = useState(null);



  const handleScan = async (xmlText) => {
    const parsed = parseAadhaarXml(xmlText);
    if (!parsed) {
      toast.error("Could not parse Aadhaar QR");
      return;
    }
    setScanData(parsed);

    // either compare in frontend and call verify endpoint, or directly send scanned+manual to backend
    const matchResult = compareAadhaarWithManual(parsed, manualData);
    if (matchResult.passed) {
      // call backend to mark verified
      try {
        await api.post("/user/verify-aadhar", { userId: manualData._id, scanned: parsed });
        toast.success("Profile verified ✅");
      } catch (err) {
        toast.error("Verification failed on server");
      }
    } else {
      toast.error("Details do not match: " + matchResult.reason);
    }
  };

  // ----------- Form Submit -----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const userData = {
        name,
        aadhar,
        dob,
        age,
        phone,
        address,
        password,
        photo,
        email: email?.trim() || null, // ✅ optional
        profilePhoto: photo,  // ✅ ensure Cloudinary URL is here
      };

      const success = await signup(userData);

      if (success) {
        nav("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  // ----------- DOB → Age -----------
  const handleDobChange = (e) => {
    const dobValue = e.target.value;
    setDob(dobValue);
    if (dobValue) {
      const today = new Date();
      const birthDate = new Date(dobValue);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge >= 0 ? calculatedAge.toString() : '');
    } else {
      setAge('');
    }
  };

  // ----------- Camera Logic -----------
  const startCamera = async () => {
    setShowCamera(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("Unable to access camera");
      }
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, 320, 240);

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "live-photo.png", { type: "image/png" });
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "user_live_photo_upload"); // replace with your Cloudinary preset

          try {
            const res = await fetch(
              "https://api.cloudinary.com/v1_1/dw4xzj0ie/image/upload", // replace with your Cloud name
              { method: "POST", body: formData }
            );
            const data = await res.json();
            if (data.secure_url) {
              setPhoto(data.secure_url); // ✅ store Cloudinary URL
            } else {
              alert("Upload failed. Try again.");
            }
          } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload photo.");
          }
        }
      }, "image/png");

      // stop camera
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
      setShowCamera(false);
    }
  };


  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 py-12 px-4 flex items-center justify-center">
      <div>
        <AadharScanner onScan={handleScan} onError={(e) => toast.error(String(e))} />
        {scanData && <pre className="text-xs">{JSON.stringify(scanned, null, 2)}</pre>}
      </div>
      <div className="max-w-2xl w-full mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-emerald-400 to-sky-500 p-3 rounded-2xl shadow-2xl shadow-emerald-500/50">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Secure Signup</h1>
              <p className="text-blue-200 text-sm">Create Your Account</p>
            </div>
          </div>
          <p className="text-slate-400 text-lg">Fill in your details to create a secure account</p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Personal Info */}
            <div className="pb-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label>Full Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name"
                    required className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label>Date of Birth</label>
                  <input type="date" value={dob} onChange={handleDobChange} required
                    className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label>Age</label>
                  <input type="number" value={age} readOnly placeholder="Auto-calculated"
                    className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
              </div>
            </div>

            {/* Live Photo */}
            <div className="pb-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-pink-400 mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Live Photo
              </h3>
              <div className="flex flex-col items-center space-y-3">
                {!photoPreview && !showCamera && (
                  <button type="button" onClick={startCamera}
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-blue-400 transition">
                    <Camera className="w-5 h-5" />
                    <span>Click Live Photo</span>
                  </button>
                )}

                {showCamera && (
                  <div className="flex flex-col items-center space-y-2">
                    <video ref={videoRef} width={320} height={240} autoPlay className="rounded-xl border border-slate-700" />
                    <button type="button" onClick={capturePhoto}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-400 transition">
                      Capture
                    </button>
                  </div>
                )}

                <canvas ref={canvasRef} width={320} height={240} style={{ display: "none" }} />

                {photo && (
                  <div className="flex flex-col items-center space-y-2">
                    <img src={photo} alt="Captured" className="rounded-xl border border-slate-700 w-40 h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400 transition"
                    >
                      Remove Photo
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Contact Info */}
            <div className="pb-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-sky-400 mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label>Phone No. (linked with aadhaar card)</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number" pattern="[0-9]{10}" maxLength={10} required
                    className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label>Email Address (Optional)</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com"
                    className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
                <div className="md:col-span-2">
                  <label>Residential Address</label>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your complete address" required
                    className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2" />
                Security & Authentication
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label>Aadhar Number</label>
                  <input value={aadhar} onChange={(e) => setAadhar(e.target.value)} maxLength={12} required
                    placeholder="12-digit Aadhar number"
                    className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password" required
                    className="w-full pl-4 pr-4 py-3.5 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white" />
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-4 space-y-4">
              <button type="submit"
                className="w-full bg-emerald-400 hover:bg-emerald-300 text-white font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition">
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="text-center">
                <span className="text-slate-400 text-sm">Already have an account? </span>
                <button onClick={() => nav('/login')} type="button"
                  className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Login here
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
