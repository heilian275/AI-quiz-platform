// client/src/utils/auth.ts
import { useStorage } from "@vueuse/core";
import { resetRoutes } from "../router";

const serverToken = useStorage<string>("serverToken", "");

export function validateToken(): boolean {
  const token = serverToken.value;
  if (!token) {
    console.log("No token found");
    return false;
  }

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);

    // 检查是否过期
    if (payload && payload.exp && payload.exp * 1000 < Date.now()) {
      console.log("Token has expired");
      resetRoutes();
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    resetRoutes();
    return false;
  }
}
