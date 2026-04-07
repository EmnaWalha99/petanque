import { useEffect } from "react";
import { useRouter } from "next/router";
import Parse from "../parseConfig/parseConfig";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const currentUser = Parse.User.currentAsync();
    if (currentUser) {
      router.push("/matches");
    } else {
      router.push("/login");
    }
  }, []);

  return null;
}