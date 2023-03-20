from fastapi import FastAPI
import mysql.connector

app = FastAPI()


mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="cisco123",
  database="lyrics"
)
mycursor = mydb.cursor(buffered=True)



@app.get("/")
async def root():
    mycursor.execute("SELECT * FROM lyrics ORDER BY RAND()")
    response = mycursor.fetchone()
    return "Bonjour"