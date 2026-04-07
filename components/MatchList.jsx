import { useState } from 'react';
import Parse from "../parseConfig/parseConfig";


export default function MatchList({matches, onDelete,loading }){
    const [deletingId, setDeletingId]=useState(null);

    const handleDelete = async(matchId)=>{
      setDeletingId(matchId);
      try{
        const Match = Parse.Object.extend("Match");
        const query = new Parse.Query(Match);
        const match = await query.get(matchId);
        await match.destroy();
        onDelete();
      }catch(err){
        alert("Erreur lors de la suppression: "+err.message);
      }
      finally{
        setDeletingId(null);
      }
    };
    if(loading){
        return <p>Chargement des matches...</p>;
    }
    if(matches.length===0){
        return <p>Aucun match trouvé. Ajoutez-en un !</p>;
    }
    return (
      <div>
      <h2>Liste des matchs</h2>

      {matches.map((match) => (
        <div
          key={match.objectId}
          style={{ borderBottom: "1px solid grey", padding: "8px 0" }}
        >
          <span>
            <strong>{match.name}</strong> — {match.score1} / {match.score2}
          </span>

          {" "}

          <button
            onClick={() => handleDelete(match.objectId)}
            disabled={deletingId === match.objectId}
          >
            {deletingId === match.objectId ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      ))}
    </div>  
    );
}