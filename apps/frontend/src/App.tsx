import { useEffect, useState } from "react";
import type { JwtPayload } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  "https://qwhpsesytnonmvljpqzf.supabase.co",
  "sb_publishable_bfebdWejqNWIRrgkAfEvKQ_014qBpu3",
);

import "./App.css";

function App() {
  const [claims, setClaims] = useState<JwtPayload | null>(null);

  // Email OTP flow state
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getClaims().then((response) => {
      setClaims(response.data?.claims ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getClaims().then((response) => {
        setClaims(response.data?.claims ?? null);
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithSolana = async () => {
    setErrorMsg(null);
    const { error } = await supabase.auth.signInWithWeb3({
      chain: "solana",
      statement: "I Confirm i want to sign in prediction market v2",
    });
    if (error) setErrorMsg(error.message);
  };

  const sendOtp = async () => {
    if (!email) {
      setErrorMsg("Please enter an email address");
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // true = allow new users to sign up via email
        // false = only existing users can sign in
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setOtpSent(true);

  };

  const verifyOtp = async () => {
    if (!otp) {
      setErrorMsg("Please enter the OTP code");
      return;
    }
    
    setErrorMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // success — claims will refresh automatically via onAuthStateChange
    setOtpSent(false);
    setOtp("");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setClaims(null);
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
      <h2>Prediction Market v2 — Login</h2>

      {claims ? (
        <div>
          <p>Signed in ✅</p>
          <pre style={{ textAlign: "left", fontSize: 12 }}>
            {JSON.stringify(claims, null, 2)}
          </pre>
          <button onClick={signOut}>Sign out</button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 24 }}>
            <button onClick={signInWithSolana}>Sign in with Solana</button>
          </div>

          <hr />

          <div style={{ marginTop: 24 }}>
            <h4>Sign in with Email</h4>

            {!otpSent ? (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{ marginRight: 8 }}
                />
                <button onClick={sendOtp} disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <p>Code sent to {email}</p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP code"
                  style={{ marginRight: 8 }}
                />
                <button onClick={verifyOtp} disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <br />
                <button
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                  style={{ marginTop: 8 }}
                >
                  Use a different email
                </button>
              </>
            )}
          </div>

          {errorMsg && (
            <p style={{ color: "red", marginTop: 16 }}>{errorMsg}</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;