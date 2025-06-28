import React from 'react';

export default function Button({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`bg-primary text-white py-3 px-5 w-full rounded-lg hover:bg-yellow-600 transition  text-md  shadow-lg tracking-wide ${className}`}
            style={{ fontFamily: 'Cormorant, sans-serif', }}
            {...props}
        >
            {children}
        </button>
    );
} 