import React from "react";

const QuickTag = () => {
    return (
        <div className="w-full h-16 primaryColor flex items-center overflow-hidden border-b border-black relative">
            <div className="flex whitespace-nowrap moving">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="flex items-center mx-8  bg-white  text-center">

                        <h1 className="text-white text-lg font-medium tracking-tight primaryColor">Free 30 Days Trial</h1>

                    </div>
                ))}
            </div>
        </div>
    )
};

export default QuickTag;