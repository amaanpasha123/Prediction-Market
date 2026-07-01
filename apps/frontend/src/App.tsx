import axios from "axios";
import "./App.css";
import { useUser } from "./hooks/useUser";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";

function App() {
  const [supabase, setSupabase] = useState(createClient(
      "https://qwhpsesytnonmvljpqzf.supabase.co",
      "sb_publishable_bfebdWejqNWIRrgkAfEvKQ_014qBpu3",
    ));
    return <AppWrapper supabase={supabase} />
}

function AppWrapper({supabase} : {supabase : SupabaseClient}) {
  const {
    claims,
    email,
    setEmail,
    otp,
    setOtp,
    otpSent,
    loading,
    errorMsg,
    signInWithSolana,
    setOtpSent,
    sendOtp,
    verifyOtp,
    signOut,
  } = useUser();

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
          <br />
          <br />
          <button
            onClick={ async () => {
              await supabase.auth.getSession().then(
                (r) => {
                  console.log(r.data.session?.access_token);
                  axios.post("http://localhost:3000/buy", {
                  },{
                    headers:{
                      Authorization: `Bearer ${r.data.session?.access_token}`
                    }
                  });
                }
              );
            }}
          >
            Click here to buy
          </button>
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
