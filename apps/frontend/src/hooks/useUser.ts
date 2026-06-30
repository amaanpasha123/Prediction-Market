import { useEffect, useState } from "react";
import type { JwtPayload } from "@supabase/supabase-js";
import { useSupabase } from "./useSupabase";

export function useUser() {
  const [claims, setClaims] = useState<JwtPayload | null>(null);
  const supabase = useSupabase();

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

  return {
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
  };
}
