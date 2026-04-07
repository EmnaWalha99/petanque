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
      const Match = Parse.Object.extend("Match");
      const query = new Parse.Query(Match);
      const results = await query.find();
      setMatches(results.map((match) => ({
        objectId: match.id,
        name: match.get("name"),
        score1: match.get("score1"),
        score2: match.get("score2"),
      })));
    } catch (err) {
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

      {/* onMatchAdded : après ajout, on rafraîchit la liste */}
      <MatchForm onMatchAdded={fetchMatches} />

      <hr />

      {/* onDelete : après suppression, on rafraîchit la liste */}
      <MatchList
        matches={matches}
        onDelete={fetchMatches}
        loading={loadingMatches}
      />
    </div>
  );
}