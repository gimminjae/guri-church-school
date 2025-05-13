import React from 'react';

interface ThermometerProps {
    value: number;
    max: number;
}

const Thermometer: React.FC<ThermometerProps> = ({ value, max }) => {
    const normalizedValue = Math.min(Math.max(0, value), max);
    const fillPercentage = (normalizedValue / max) * 100;

    return (
        <div className="relative w-24 h-64">
            {/* Main thermometer body */}
            <div className="absolute left-1/2 -translate-x-1/2 w-8 h-[calc(100%-12px)] bg-white rounded-t-full border-4 border-gray-300 overflow-hidden">
                {/* Red mercury fill */}
                <div
                    className="absolute bottom-0 w-full bg-red-500 transition-all duration-300 ease-in-out"
                    style={{
                        height: `${fillPercentage}%`,
                    }}
                />
            </div>

            {/* Measurement marks */}
            <div className="absolute right-0 h-[85%] top-[7.5%] flex flex-col justify-between">
                {[...Array(11)].map((_, i) => (
                    <div key={i} className="flex items-center">
                        <div className="w-3 h-[2px] bg-gray-400 mr-1" />
                        <span className="text-xs text-gray-600 min-w-[2rem]">
                            {Math.round(max - (i * (max / 10))) - 10}
                        </span>
                    </div>
                ))}
            </div>

            {/* Bottom bulb */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-gray-300 bg-white overflow-hidden">
                <div
                    className="absolute bottom-0 w-full bg-red-500 transition-all duration-300 ease-in-out"
                    style={{
                        height: normalizedValue > 0 ? '100%' : '0%'
                    }}
                />
                <div className="absolute top-1 left-2 w-2 h-2 bg-white rounded-full opacity-50" />
            </div>

            {/* Current value indicator */}
            <div
                className="absolute left-full ml-2 text-sm font-semibold"
                style={{
                    bottom: `${fillPercentage}%`,
                }}
            >
                {normalizedValue}
            </div>
        </div>
    );
};

export default Thermometer;
