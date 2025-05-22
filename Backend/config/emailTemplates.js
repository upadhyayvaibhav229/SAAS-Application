export const EMAIL_VERIFY_TEMPLATE = `
  <div style="background-color: #f7fafc; min-height: 100vh; display: flex; justify-content: center; align-items: center;">
    <div style="background-color: #ffffff; max-width: 28rem; width: 100%; padding: 2rem; margin: 1.5rem; box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); border-radius: 0.5rem;">
      <h1 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Verify your email</h1>
      <p style="margin-bottom: 1rem;">
        You are just one step away to verify your account for this email: <span style="color: #3b82f6;">{{email}}</span>.
      </p>
      <p style="font-weight: 600; margin-bottom: 1rem;">Use the below OTP to verify your account.</p>
      <div style="background-color: #10b981; color: #ffffff; font-weight: bold; padding: 0.5rem 1rem; border-radius: 0.25rem; text-align: center; margin-bottom: 1rem;">
        {{otp}}
      </div>
      <p>This OTP is valid for 24 hours.</p>
    </div>
  </div>
`;

export const PASSWORD_RESET_TEMPLATE = `
  <div style="background-color: #f7fafc; min-height: 100vh; display: flex; justify-content: center; align-items: center;">
    <div style="background-color: #ffffff; max-width: 28rem; width: 100%; padding: 2rem; margin: 1.5rem; box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); border-radius: 0.5rem;">
      <h1 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Forgot your password?</h1>
      <p style="margin-bottom: 1rem;">
        We received a password reset request for your account: <span style="color: #3b82f6;">{{email}}</span>.
      </p>
      <p style="font-weight: 600; margin-bottom: 1rem;">Use the OTP below to reset the password.</p>
      <div style="background-color: #10b981; color: #ffffff; font-weight: bold; padding: 0.5rem 1rem; border-radius: 0.25rem; text-align: center; margin-bottom: 1rem;">
        {{otp}}
      </div>
      <p>The password reset otp is only valid for the next 15 minutes.</p>
    </div>
  </div>
`;

