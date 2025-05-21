export const EMAIL_VERIFY_TEMPLATE = (
  <div className="bg-gray-100 min-h-screen flex justify-center items-center">
    <div className="bg-white max-w-md w-full p-8 m-6 shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4">Verify your email</h1>
      <p className="mb-4">
        You are just one step away to verify your account for this email: <span className="text-blue-500">{{email}}</span>.
      </p>
      <p className="font-semibold mb-4">Use the below OTP to verify your account.</p>
      <div className="bg-green-500 text-white font-bold py-2 px-4 rounded text-center mb-4">
        {{otp}}
      </div>
      <p>This OTP is valid for 24 hours.</p>
    </div>
  </div>
);

export const PASSWORD_RESET_TEMPLATE = (
  <div className="bg-gray-100 min-h-screen flex justify-center items-center">
    <div className="bg-white max-w-md w-full p-8 m-6 shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4">Forgot your password?</h1>
      <p className="mb-4">
        We received a password reset request for your account: <span className="text-blue-500">{{email}}</span>.
      </p>
      <p className="font-semibold mb-4">Use the OTP below to reset the password.</p>
      <div className="bg-green-500 text-white font-bold py-2 px-4 rounded text-center mb-4">
        {{otp}}
      </div>
      <p>The password reset otp is only valid for the next 15 minutes.</p>
    </div>
  </div>
);

