import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MatchForm from "../components/MatchForm";
import MatchList from "../components/MatchList";
import Parse from "../parseConfig/parseConfig";

export default function MatchesPage() {
  const router = useRouter();

  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = Parse.User.current();

    if (!user) {
      router.push("/login");
      return;
    }

    setCurrentUser(user);
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoadingMatches(true);
    try {
      // On récupère le session token et on le passe explicitement
      const sessionToken = Parse.User.current()?.getSessionToken();

      const results = await Parse.Cloud.run(
        "getMatches",
        {},
        { sessionToken }
      );
      setMatches(results);
    } catch (err) {
      if (err.code === Parse.Error.SESSION_MISSING) {
        router.push("/login");
        return;
      }
      alert("Erreur lors du chargement des matchs : " + err.message);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleLogout = async () => {
    await Parse.User.logOut();
    router.push("/login");
  };

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>

      <div>
        <h1 style={{ display: "inline" }}>Pétanque App</h1>
        {" — "}
        <span>Connecté en tant que : <strong>{currentUser?.get("username")}</strong></span>
        {" "}
        <button onClick={handleLogout}>Se déconnecter</button>
      </div>

      <hr />

      <MatchForm onMatchAdded={fetchMatches} />

      <hr />

      <MatchList
        matches={matches}
        onDelete={fetchMatches}
        loading={loadingMatches}
      />

    </div>
  );
}