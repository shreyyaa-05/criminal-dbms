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
export const getCriminalsByCrime = async (req, res, next) => {

  const qry = "SELECT Criminals.first_name, Criminals.last_name,Crimes.crime_name FROM Criminals JOIN Crimes ON Criminals.crime_id=Crimes.crime_id WHERE Crimes.crime_name='Robbery' ";
  db.query(qry, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(data);

  })
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



export const getCriminalsByFilters=(req,res)=>{

const filters=req.body;

const conditions=[];
const values=[];

if(filters.crimeType){
conditions.push(
'Crimes.crime_name = ?'
);
values.push(filters.crimeType);
}

if(filters.prison){
conditions.push(
'Prison.prison_name = ?'
);
values.push(filters.prison);
}

if(filters.name){
conditions.push(
'Criminals.first_name LIKE ?'
);
values.push(`%${filters.name}%`);
}

if(filters.location){
conditions.push(
'location = ?'
);
values.push(filters.location);
}

if(filters.sentenceStatus){
conditions.push(
'status = ?'
);
values.push(filters.sentenceStatus);
}

let sql = `
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
JOIN Cases
ON Criminals.case_id = Cases.case_id
JOIN Crimes
ON Criminals.crime_id = Crimes.crime_id
LEFT JOIN Prison
ON Criminals.prison_id = Prison.prison_id
`;

if(conditions.length>0){
sql +=
' WHERE ' + conditions.join(' AND ');
}

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
export const getFeaturedCases = (req,res)=>{
const q=`
SELECT
case_description,
location,
date_committed,
status
FROM cases
ORDER BY
CASE
 WHEN status='Critical' THEN 1
 WHEN status='High' THEN 2
 ELSE 3
END
LIMIT 6
`;

db.query(q,(err,data)=>{
 if(err) return res.status(500).json(err);
 return res.status(200).json(data);
});
}
export const getHotspots=(req,res)=>{
const q=`
SELECT
a.area_name,
COUNT(c.case_id) AS cases_count
FROM area a
LEFT JOIN cases c
ON a.area_id=c.area_id
GROUP BY a.area_id,a.area_name
ORDER BY cases_count DESC
LIMIT 5
`;

db.query(q,(err,data)=>{
 if(err){
   return res.status(500).json(err);
 }
 return res.status(200).json(data);
});
}