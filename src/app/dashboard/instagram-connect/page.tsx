"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function InstagramConnectPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    const expires = params.get("expires");
    const igUserId = params.get("igUserId");

    if (!token || !expires || !igUserId) {
      router.replace("/dashboard?ig=error");
      return;
    }

    const expiresAt = Date.now() + Number(expires) * 1000;

    localStorage.setItem(
      "ig_auth",
      JSON.stringify({
        accessToken: token,
        igUserId,
        expiresAt,
      })
    );

    //vyčistí URL
    router.replace("/dashboard?ig=connected");
  }, [params, router]);

  return null;
}
