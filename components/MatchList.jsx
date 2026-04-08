import { useState } from 'react';
import Parse from "../parseConfig/parseConfig";


export default function MatchList({matches, onDelete,loading }){
    const [deletingId, setDeletingId]=useState(null);

    const handleDelete = async(matchId)=>{
      setDeletingId(matchId);
      try{
        // On récupère le session token et on le passe explicitement
        const sessionToken = Parse.User.current()?.getSessionToken();
        //appel de la cloud function deleteMatch
        await Parse.Cloud.run(
          "deleteMatch",
          { matchId },//param
          { sessionToken }//authentification
        );

        onDelete();//notify parent to refresh list
      }catch(err){
        alert("Erreur lors de la suppression: "+err.message);
      }
      finally{
        setDeletingId(null);//reset state
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
            onClick={() => handleDelete(match.objectId)}//pass match id to delete
            disabled={deletingId === match.objectId}//disable button during deletion
          >
            {deletingId === match.objectId ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      ))}
    </div>  
    );
}