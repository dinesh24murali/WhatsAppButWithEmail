import React from 'react';

import Input from 'helpers/Input/Input';

export default function ResetpasswordForm({ value = {}, onChange = () => {}, error = {} }) {
  const { password, confirmPassword } = value;

  return (
    <>
      <div className="mb-2 w-1/2">
        <label htmlFor="password" className="font-medium mb-3 text-gray-600">
          Password
        </label>
        <Input
          type="password"
          name="password"
          className="w-full"
          onChange={(event) => onChange(event.target)}
          value={password}
          placeholder="Password"
        />
        {error.email && <p className="text-red-600 mt-3">{error.password}</p>}
      </div>
      <div className="mb-2 w-1/2">
        <label htmlFor="confirmPassword" className="font-medium mb-3 text-gray-600">
          Confirm password
        </label>
        <Input
          type="password"
          className="w-full"
          name="confirmPassword"
          onChange={(event) => onChange(event.target)}
          value={confirmPassword}
          placeholder="Confirm password"
        />
        {error.password && <p className="text-red-600 mt-3">{error.confirmPassword}</p>}
      </div>
    </>
  );
}
