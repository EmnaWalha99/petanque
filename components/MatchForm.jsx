import { useState } from "react";
import Parse from "../parseConfig/parseConfig";

export default function MatchForm({ onMatchAdded}){
    const [name,setName]= useState("");
    const [score1,setScore1]= useState("");
    const [score2,setScore2]=useState("");
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);

    //a l'envoi du form on appel createMatch 
    const handleSubmit = async ()=>{
        setError("");
        //validation client side
        if(!name.trim()){
            setError("Le nom du match est requis");
            return ; 

        }
        if(score1===""||score2===""){
            setError("Les deux sont requis");
            return ;
        }
        setLoading(true);
        try{
            const Match = Parse.Object.extend("Match");
            const match = new Match();
            match.set("name", name.trim());
            match.set("score1", Number(score1));
            match.set("score2", Number(score2));
            await match.save();
            //reset
            setName("");
            setScore1("");
            setScore2("");

            //notify the parent to refresh its match list
            onMatchAdded();


        }catch(err){
            setError(err.message);
        }
        finally{
            setLoading(false);
        }
    };
    return (
        <div>
        <h2>Ajouter un match</h2>

        <div>
            <label>Nom du match : </label>
            <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="example: Équipe A vs Équipe B"
            />
        </div>

        <br />

        <div>
            <label>Score équipe 1 : </label>
            <input
            type="number"
            value={score1}
            onChange={(e) => setScore1(e.target.value)}
            placeholder="ex: 13"
            min="0"
            />
        </div>

        <br />

        <div>
            <label>Score équipe 2 : </label>
            <input
            type="number"
            value={score2}
            onChange={(e) => setScore2(e.target.value)}
            placeholder="ex: 7"
            min="0"
            />
        </div>

        <br />

        {error && <p style={{ color: "grey" }}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Envoi en cours..." : "Envoyer"}
        </button>
        </div>
  );
    
}