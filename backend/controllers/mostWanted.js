import { db } from "../db.js";


export const getMostWanted = (req,res)=>{

db.query(
`
SELECT *
FROM most_wanted
LIMIT 10
`,
(err,data)=>{

if(err){
return res.status(500).json(err);
}

res.json(data);

}

);

};



export const getMostWantedStats = (req,res)=>{

db.query(
`
SELECT

COUNT(*) total_targets,

SUM(
CASE
WHEN threat_score>=9 THEN 1
ELSE 0
END
) red_notice,

AVG(threat_score) avg_threat

FROM most_wanted
`,
(err,data)=>{

if(err){
return res.status(500).json(err);
}

res.json(data[0]);

}

);

};