import React from 'react';

export default function Button({
  type = 'button',
  className = '',
  children,
  secondary = false,
  danger = false,
  ...props
}) {
  // className={`w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${className}`}
  if (danger)
    return (
      <button
        type={type}
        className={`w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-white hover:bg-red-700 focus:outline-none ${className}`}
        {...props}>
        {children}
      </button>
    );

  // className={`w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 ${className}`}
  if (secondary)
    return (
      <button
        type={type}
        className={`w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none ${className}`}
        {...props}>
        {children}
      </button>
    );

  return (
    <button
      type={type}
      className={`p-2 bg-blue-500 hover:bg-blue-700 rounded-md text-white shadow-md w-24 focus:outline-none ${className}`}
      {...props}>
      {children}
    </button>
  );
}
