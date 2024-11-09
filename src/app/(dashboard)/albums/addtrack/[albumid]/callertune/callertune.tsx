import React, { useState, ChangeEvent } from "react";

function CallerTune() {
  const [callerTuneTime, setCallerTuneTime] = useState<string>("");
  const [errors, setErrors] = useState<{ callerTuneTime?: { _errors: string[] } }>({});

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Remove all non-numeric characters
    if (value.length > 6) value = value.slice(0, 6); // Limit to 6 digits

    if (value.length >= 3) {
      value = `${value.slice(0, 2)}:${value.slice(2, 4)}:${value.slice(4, 6)}`;
    } else if (value.length >= 2) {
      value = `${value.slice(0, 2)}:${value.slice(2, 4)}`;
    } else {
      value = value;
    }

    setCallerTuneTime(value);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">
        Caller Tune Time (HH:MM:SS)
      </label>
      <input
        name="crbt"
        type="text"
        placeholder="00:00:00"
        value={callerTuneTime}
        onChange={handleTimeChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength={8}
        required
      />
      {errors.callerTuneTime && (
        <p className="text-red-500 text-sm mt-1">
          {errors.callerTuneTime._errors[0]}
        </p>
      )}
    </div>
  );
}

export default CallerTune;
