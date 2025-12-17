"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InstagramConnect() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get("token");
    const expires = params.get("expires");
    const igUserId = params.get("igUserId");

    if (!token || !expires) {
      router.replace("/dashboard?ig=error");
      return;
    }

    const expiresAt = Date.now() + Number(expires) * 1000;

    localStorage.setItem(
      "ig_auth",
      JSON.stringify({
        accessToken: token,
        expiresAt,
        igUserId,
      })
    );

    router.replace("/dashboard?ig=connected");
  }, []);

  return null;
}
