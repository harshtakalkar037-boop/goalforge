"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

export function useUser() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Get current authenticated user
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        // Not logged in
        if (!authUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Fetch profile
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        // Log actual error details
        if (error) {
  console.warn("Profile fetch warning:", error);
}

        // If profile exists, use it
        if (profile) {
          setUser(profile as Profile);
        } else {
          // Fallback: use auth user so dashboard can still load
          setUser({
            id: authUser.id,
            email: authUser.email ?? "",
            full_name:
              authUser.user_metadata?.full_name ||
              authUser.email?.split("@")[0] ||
              "User",
            role: "employee",
          } as Profile);
        }
      } catch (err) {
        console.error("useUser error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return {
    user,
    loading,
    signOut,
  };
}