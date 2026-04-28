import axios from "axios";
import { db } from "../db.js";

export const fetchDelhiCrimeNews = async () => {

try{

const response=await axios.get(
"https://gnews.io/api/v4/search",
{
params:{
q:"Delhi crime OR Delhi police OR robbery Delhi",
lang:"en",
country:"in",
max:10,
apikey:process.env.GNEWS_KEY
}
}
);

const articles=response.data.articles;

for(const article of articles){

db.query(
`
INSERT IGNORE INTO news_cache
(title,source,description,url,published_at)
VALUES(?,?,?,?,?)
`,
[
article.title,
article.source.name,
article.description,
article.url,
article.publishedAt
]
);

}

}
catch(err){
console.error(err);
}

};



export const getNews=async(req,res)=>{



db.query(
`
SELECT *
FROM news_cache
ORDER BY published_at DESC
LIMIT 20
`,
(err,data)=>{

if(err){
return res.status(500).json(err);
}

res.json(data);

}
);

};