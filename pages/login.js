import { useState } from "react";
import { useRouter } from "next/router";
import Parse from "../parseConfig/parseConfig";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await Parse.User.logIn(username, password);
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
      const user = new Parse.User();
      user.set("username", username);
      user.set("password", password);
      await user.signUp();
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