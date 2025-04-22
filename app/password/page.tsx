"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [length, setLength] = useState<number>(8);
  const [allowNumber, setAllowNumber] = useState<boolean>(false);
  const [allowCharacter, setAllowCharacter] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const refernce = useRef<HTMLInputElement>(null);

  const generatePassword = () => {
    let pass = "";
    let str = "QWERTYUIOPLKJHGFDSAZXCVBNMqwertyuioplkjhgfdsazxcvbnm";
    const num = "0123456789";
    const specialChar = "@#$&*{[)}(]";

    if (allowNumber) str += num;
    if (allowCharacter) str += specialChar;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * str.length);
      pass += str.charAt(randomIndex);
    }

    setPassword(pass);
  };

  useEffect(() => {
    generatePassword();
  }, [length, allowNumber, allowCharacter]);

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLength(parseInt(e.target.value));
  };

  const handleNumberChange = () => {
    setAllowNumber((prev) => !prev);
  };

  const handleCharacterChange = () => {
    setAllowCharacter((prev) => !prev);
  };

  const copyToClipBoard = useCallback(() => {
    window.navigator.clipboard.writeText(password);
    toast.success("🔔 Password copied!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      theme: "dark",
    });
  }, [password]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center">
          Password Generator
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <input
            className="w-full sm:flex-1 h-12 px-4 rounded-lg bg-zinc-800 text-lg text-orange-400 font-mono"
            placeholder="Password"
            value={password}
            readOnly
            ref={refernce}
            type="text"
          />
          <button
            onClick={copyToClipBoard}
            className="w-full sm:w-auto px-5 h-12 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Copy
          </button>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-2">
            <input
              type="range"
              value={length}
              max={50}
              min={8}
              className="w-full accent-orange-500"
              onChange={handleLengthChange}
            />
            <span className="text-sm font-medium text-white">
              Length: {length}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between">
            <label className="flex items-center gap-2 font-medium text-white">
              <input
                id="number"
                type="checkbox"
                checked={allowNumber}
                onChange={handleNumberChange}
                className="accent-orange-500 w-5 h-5"
              />
              Numbers
            </label>

            <label className="flex items-center gap-2 font-medium text-white">
              <input
                id="character"
                type="checkbox"
                checked={allowCharacter}
                onChange={handleCharacterChange}
                className="accent-orange-500 w-5 h-5"
              />
              Special Chars
            </label>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default App;
