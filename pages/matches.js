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
  //runs once the component mounts
  useEffect(() => {
    //get the current user
    const user = Parse.User.current();
    //if not logged in 
    if (!user) {
      router.push("/login");//redirect to login page
      return;
    }
    //set the state
    setCurrentUser(user);
    //retrieve matches from backend
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoadingMatches(true);
    try {
      // get session token of the current user
      const sessionToken = Parse.User.current()?.getSessionToken();
      //call Parse cloud function getMatches
      const results = await Parse.Cloud.run(
        "getMatches",
        {},//sans param
        { sessionToken }//authentication
      );
      //set results in state
      setMatches(results);
    } catch (err) {
      //si la session invalide ou expirée
      if (err.code === Parse.Error.SESSION_MISSING) {
        router.push("/login");
        return;
      }
      alert("Erreur lors du chargement des matchs : " + err.message);
      //or setError
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleLogout = async () => {
    await Parse.User.logOut();//clear session
    router.push("/login");//redirect to login
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
        matches={matches} //data
        onDelete={fetchMatches}//refresh after delete
        loading={loadingMatches}//loading state
      />

    </div>
  );
}