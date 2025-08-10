import React from 'react';
import CountUp from 'react-countup';

const MemberCount = ({ count = 0, label = "Participants", duration = 2, className = "" }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className="text-3xl font-bold text-blue-600">
        <CountUp start={0} end={count} duration={duration} separator="," />
      </span>
      <span className="text-gray-600 text-sm mt-1">{label}</span>
    </div>
  );
};

export default MemberCount;
