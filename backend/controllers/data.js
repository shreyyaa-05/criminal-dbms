import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllCriminals=(req,res)=>{

const q=`
SELECT
Criminals.criminal_id,
Criminals.first_name,
Criminals.last_name,
Criminals.gender,
Criminals.address,
Cases.location,
Cases.case_description,
Cases.status,
Crimes.crime_name,
Prison.prison_name

FROM Criminals

LEFT JOIN Cases
ON Criminals.case_id=Cases.case_id

LEFT JOIN Crimes
ON Criminals.crime_id=Crimes.crime_id

LEFT JOIN Prison
ON Criminals.prison_id=Prison.prison_id
`;

db.query(q,(err,data)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

return res.json(data);

});

}
export const getCriminalsByCrime=(req,res)=>{

const qry=`
SELECT DISTINCT
crime_id,
crime_name
FROM Crimes
ORDER BY crime_name
`;

db.query(qry,(err,data)=>{
if(err){
console.log(err);
return res.status(500).json(err);
}
res.json(data);
});

};


export const regComplaint = async (req, res, next) => {
  try {
    const qry = `INSERT INTO user_complaint (Name, Email, Complaint, Category, Severity) VALUES (?, ?, ?, ?, ?)`;
    const values = [req.body.Name, req.body.Email, req.body.Complaint, req.body.Category, req.body.Severity];

    db.query(qry, values, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to insert complaint' });
      } else {
        res.json(data);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to insert complaint' });
  }
};
export const getComplaint = async (req, res, next) => {
     try{
      const qry = "SELECT * FROM User_Complaint";
      db.query(qry, (err, data) => {
        if (err) {
          console.log(err);
        }
        res.json(data);
        //  console.log(data);
      })
     }
     catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get Complaint' });
    }
    
};




export const getCriminalsByPrison = async (req, res, next) => {

  const qry = "SELECT Criminals.first_name, Criminals.last_name,Crimes.crime_name, Prison.prison_name FROM Criminals LEFT JOIN Prison ON Prison.prison_id = Criminals.prison_id JOIN Crimes ON Criminals.crime_id=Crimes.crime_id WHERE Prison.prison_name='Tihar Jail' ";
  db.query(qry, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(data);

  })
};

export const getCriminalsByGender = async (req, res, next) => {

  const qry = "SELECT first_name, last_name, address,gender FROM Criminals WHERE gender='Male'";
  db.query(qry, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(data);

  })
};
export const getCriminalsByLocation = async (req,res)=>{
const qry=`
SELECT Criminals.first_name,
Criminals.last_name,
Cases.case_description,
Cases.location
FROM Criminals
JOIN Cases
ON Criminals.case_id=Cases.case_id
WHERE Cases.location IN
('Rohini','Dwarka','Saket','Connaught Place','Lajpat Nagar')
`;

db.query(qry,(err,data)=>{
 if(err) console.log(err);
 res.json(data);
});
}
export const getCriminalsByYear = async (req, res, next) => {

  const qry = "SELECT Criminals.first_name, Criminals.last_name,Cases.case_description FROM Criminals JOIN Cases ON Criminals.case_id=Cases.case_id WHERE Cases.date_committed='2023-01-15'";
  db.query(qry, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(data);

  })
};
export const getCriminalsByStatus = async (req, res, next) => {

  const qry = "SELECT Criminals.first_name, Criminals.last_name,Cases.case_description FROM Criminals JOIN Cases ON Criminals.case_id=Cases.case_id WHERE Cases.status='Open'";
  db.query(qry, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(data);

  })
};



export const getCriminalsByFilters = (req,res)=>{

const filters=req.body;
const conditions=[];
const values=[];


/* NAME SEARCH (first or last name) */
if(filters.name?.trim()){
conditions.push(`
(
Criminals.first_name LIKE ?
OR Criminals.last_name LIKE ?
)
`);
values.push(
`%${filters.name}%`,
`%${filters.name}%`
);
}


/* CRIME */
/* CRIME */
if(filters.crimeType && filters.crimeType!=="all"){
conditions.push(
'Criminals.crime_id = ?'
);
values.push(Number(filters.crimeType));
}


/* AREA */
if(filters.location && filters.location!=="all"){
conditions.push(
'Cases.location = ?'
);
values.push(filters.location);
}


/* STATUS */
if(filters.sentenceStatus && filters.sentenceStatus!=="all"){
conditions.push(
'Cases.status = ?'
);
values.push(filters.sentenceStatus);
}


/* PRISON */
if(filters.prison && filters.prison!=="all"){
conditions.push(
'Prison.prison_id = ?'
);
values.push(Number(filters.prison));
}



let sql=`
SELECT DISTINCT
Criminals.criminal_id,
Criminals.first_name,
Criminals.last_name,
Criminals.gender,
Criminals.address,

Cases.case_id,
Cases.case_description,
Cases.location,
Cases.status,
DATE_FORMAT(Cases.date_committed,'%Y-%m-%d') as date_committed,

Crimes.crime_id,
Crimes.crime_name,

Prison.prison_id,
Prison.prison_name,

Area.area_id,
Area.area_name,
Area.police_station

FROM Criminals

LEFT JOIN Cases
ON Criminals.case_id = Cases.case_id

LEFT JOIN Crimes
ON Criminals.crime_id = Crimes.crime_id

LEFT JOIN Prison
ON Criminals.prison_id = Prison.prison_id

LEFT JOIN Area
ON Cases.area_id = Area.area_id
`;



if(conditions.length){
sql +=
' WHERE ' +
conditions.join(' AND ');
}

sql += `
 ORDER BY date_committed DESC
`;
console.log(sql);
console.log(values);
db.query(
sql,
values,
(err,data)=>{
if(err){
console.error(err);
return res.status(500).json(err);
}

res.json(data);
}
);

};



export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    console.log("passed");

    db.query(
      "INSERT INTO user (username,email,password) VALUES (?,?,?)",
      [req.body.username, req.body.email, hash],
      (err, result) => {
        console.log(err);
        console.log(result);
      }
    );
    // await newUser.save().then(()=>{console.log("user made")}); SAVE NEW USER OBJECT IN USER SCHEMA
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Query the database to get the user with the provided username
    db.query('SELECT * FROM user WHERE username = ?', username, async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (result.length > 0) {
        const isPasswordValid = await bcrypt.compare(password, result[0].password);

        if (isPasswordValid) {
          res.status(200).json({user: { email: result[0].email, username: result[0].username } });
        } else {
          // Password is incorrect
          res.status(401).json({ message: 'Incorrect password' });
        }
      } else {
        // User not found
        res.status(404).json({ message: 'User not found' });
      }
    });
  } catch (err) {
    next(err);
  }
};
export const getFeaturedCases=(req,res)=>{

let q=`
SELECT DISTINCT
Cases.case_id,
Cases.case_description,
Cases.location,
Cases.date_committed,
Cases.status,
COALESCE(Crimes.crime_name,'Unknown') as crime_name,
Area.latitude,
Area.longitude

FROM Cases

 JOIN Area
ON Cases.area_id = Area.area_id

LEFT JOIN Criminals
ON Cases.case_id = Criminals.case_id

LEFT JOIN Crimes
ON Criminals.crime_id = Crimes.crime_id
`;

const conditions=[];
const vals=[];

if(req.query.area_id && req.query.area_id !== "all"){
conditions.push(
"Cases.area_id = ?"
);
vals.push(req.query.area_id);
}

if(req.query.crime_id && req.query.crime_id !== "all"){
conditions.push(
'Crimes.crime_name = ?'
);
vals.push(req.query.crime_id);
}

if(req.query.from_date){
conditions.push(
"Cases.date_committed >= ?"
);
vals.push(req.query.from_date);
}

if(req.query.to_date){
conditions.push(
"Cases.date_committed <= ?"
);
vals.push(req.query.to_date);
}

if(conditions.length>0){
q += " WHERE " + conditions.join(" AND ");
}

q += `
 ORDER BY Cases.date_committed DESC
 LIMIT 15
`;

db.query(q,vals,(err,data)=>{
if(err){
console.error(err);
return res.status(500).json(err);
}

return res.json(data);

});

};
export const getHotspots=(req,res)=>{

const q=`
SELECT
area_id,
area_name,
latitude,
longitude
FROM Area
ORDER BY area_name
`;

db.query(q,(err,data)=>{
if(err){
return res.status(500).json(err);
}
res.json(data);
});

};
export const getEvidence=(req,res)=>{

const q=`
SELECT
Evidence.description,
Area.latitude as lat,
Area.longitude as lng
FROM Evidence
JOIN Area
ON Evidence.area_id=Area.area_id
`;

db.query(q,(err,data)=>{
if(err){
return res.status(500).json(err);
}
res.json(data);
});

};
export const getPrisons=(req,res)=>{

db.query(
`
SELECT
prison_id,
prison_name
FROM Prison
ORDER BY prison_name
`,
(err,data)=>{
if(err){
return res.status(500).json(err);
}
res.json(data);
}
);

};
export const getStatuses=(req,res)=>{
db.query(`
SELECT DISTINCT status
FROM Cases
ORDER BY status
`,(err,data)=>{
if(err) return res.status(500).json(err);
res.json(data);
});
};
export const getCrimeStats = (req,res)=>{

const q = `
SELECT
Crimes.crime_name,
COUNT(*) as count
FROM Criminals
JOIN Crimes
ON Criminals.crime_id = Crimes.crime_id
GROUP BY Crimes.crime_name
ORDER BY count DESC
`;

db.query(q,(err,data)=>{
if(err){
console.error(err);
return res.status(500).json(err);
}

const totalCases =
data.reduce(
(sum,row)=>sum+row.count,
0
);

res.json({
totalCases,
topCrimes:data
});

});

};