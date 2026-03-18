"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState(1);

  const router = useRouter();

  // 📲 SEND OTP (FAKE)
  const sendOtp = () => {
    if (phone.length !== 10) {
      alert("Enter valid phone number");
      return;
    }

    const fakeOtp = Math.floor(1000 + Math.random() * 9000).toString();

    setGeneratedOtp(fakeOtp);
    setStep(2);

    alert(`Your OTP is ${fakeOtp}`); // 👈 demo purpose
  };

  // ✅ VERIFY OTP
  const verifyOtp = () => {
    if (otp === generatedOtp) {
      const user = { name, phone };

      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful ✅");

      router.push("/");
    } else {
      alert("Invalid OTP ❌");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <div className="bg-gray-900 p-6 rounded-xl w-80">

        <h2 className="text-xl font-bold mb-4 text-blue-400">
          Login
        </h2>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter Name"
              className="w-full p-2 mb-3 rounded bg-gray-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter Phone Number"
              className="w-full p-2 mb-3 rounded bg-gray-800"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 mb-3 rounded bg-gray-800"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 p-2 rounded hover:bg-green-700"
            >
              Verify & Login
            </button>
          </>
        )}

      </div>
    </div>
  );
}