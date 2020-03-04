from flask import Flask, jsonify, request, render_template
import json
from flask_sqlalchemy import SQLAlchemy
import psycopg2

app = Flask(__name__) 

@app.route("/")
def index(): 
    
    return render_template("index.html")

@app.route("/api/consigue")
def consigue():
    table = "o3Table"
    db = "postgresql://postgres:12345@localhost:5432/project2"
    #Database object
    con = psycopg2.connect(db)  
    cursor = con.cursor() 

    cursor.execute(f"SELECT estado, MAX(valororig), parametro FROM {table} GROUP BY estado, parametro")

    #The following was made in order to convert the response to JSON
    columns = ("estado", "valororig", "parametro")
    results = []
    for row in cursor.fetchall():
        results.append(dict(zip(columns, row)))
    resultado = json.dumps(results, indent=2)
    return resultado

if __name__=="__main__":
    app.run()
 