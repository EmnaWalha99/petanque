import { useState } from "react";
import { useRouter } from "next/router";
import Parse from "../parseConfig/parseConfig";

export default function LoginPage() {
  const router = useRouter(); //we're using an instance of the hook router to route the page after login

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    setError("");//clears errors
    setLoading(true);//start loading
    try {
      await Parse.User.logIn(username, password);//when successfully logged it stores the users in session so we can retrieve the current user
      // ensure session is ready
      await Parse.User.currentAsync(); //currentAsync for retriving user from async storage
      //redirect to matches page
      router.push("/matches");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      // when we sign up we need to create a new user object
      const user = new Parse.User();
      user.set("username", username);//set the fields in db
      user.set("password", password);
      await user.signUp();//send signup request to Parse
      router.push("/matches");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Pétanque Application</h1>
      <h2>Connexion / Inscription</h2>

      <div>
        <label>Nom d'utilisateur : </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label>Mot de passe : </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <br />

      {error && <p style={{ color: "grey" }}>{error}</p>}

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Chargement..." : "Se connecter"}
      </button>

      {" "}

      <button onClick={handleSignUp} disabled={loading}>
        {loading ? "Chargement..." : "Créer un compte"}
      </button>
    </div>
  );
}