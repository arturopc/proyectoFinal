from flask import Flask, jsonify, request, render_template
import json
from flask_sqlalchemy import SQLAlchemy
import psycopg2
import folium
import pandas as pd

app = Flask(__name__) 

nameTest = "start"

tableName = "o3"
resultsMap = [] 
#TODO: figure out map updating. 

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/graph/<string:param>')
def graph(param):
    global tableName
    tableName = param
    table = param.lower()
    return render_template("graphs.html", param = param)

@app.route("/api/consigue")
def consigue():
    global resultsMap
    global tableName
    resultsMap = []
    table = tableName + "Table"#returnTableName()
    db = "postgresql://postgres:12345@localhost:5432/project2"
    #Database object
    con = psycopg2.connect(db)  
    cursor = con.cursor() 
    cursor1 = con.cursor() 
    if table:
        cursor.execute(f"SELECT estado, MAX(valororig), parametro FROM {table} GROUP BY estado, parametro;")
        cursor1.execute(f"SELECT lat, long, city, valororig, nombre, parametro FROM {table}")
        #The following was made in order to convert the response to JSON
        columsMap = ("lat", "long", "city", "valororig", "nombre", "parametro")
        columns = ("estado", "valororig", "parametro")
        results = []
        
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))
        for row in cursor1.fetchall():
            resultsMap.append(dict(zip(columsMap,row)))
        resultado = json.dumps(results, indent=2)
        return resultado

@app.route("/api/getPrediction")
def getPrediction():
    global tableName
    table = tableName + "Prediction"
    table = table.lower()
    print(f"{table}")
    db = "postgresql://postgres:12345@localhost:5432/project2"
    #Database object
    con = psycopg2.connect(db)  
    cursor = con.cursor() 
    cursor.execute(f"SELECT valororig, nombre_x, pronostico, estado FROM {table};")
    #The following was made in order to convert the response to JSON
    columns = ("valororig", "nombre", "pronostico", "parametro")
    results = []
    for row in cursor.fetchall():
        results.append(dict(zip(columns, row)))
    resultado = json.dumps(results, indent=2)
    return resultado

@app.route("/get_map")
def get_map():
    global resultsMap
    mapDf = pd.DataFrame(resultsMap)
    centerLat = 22.396092
    centerLon = -101.731430
    foliumMap = folium.Map(location=[centerLat,centerLon],zoom_start=5)
    for i, row in mapDf.iterrows():
        valor = row.valororig
        popupTtext=f"<b> Nombre:</b>{row.nombre}<br><b> Ciudad:</b>{row.city}<br><b> Valor:</b>{round(row.valororig, 2)}<br>"
        folium.CircleMarker(location=[row.lat,row.long], radius=5, tooltip=popupTtext, fill=True, fill_capacity=.4).add_to(foliumMap)
    foliumMap.save('templates/map.html')
    return render_template('map.html')

@app.route("/get_map_home")
def get_map_home():
    resultsMapHome = []
    centerLatHome = 22.396092
    centerLonHome = -101.731430
    foliumMapHome=folium.Map(location=[centerLatHome,centerLonHome],zoom_start=5)
    foliumMapHome.save('templates/mapHome.html')
    db = "postgresql://postgres:12345@localhost:5432/project2"
    #Database object
    con = psycopg2.connect(db)  
    cursor1 = con.cursor() 
    cursor1.execute(f"SELECT lat, long, nombre FROM stationstable")
    #The following was made in order to convert the response to JSON
    columsMap = ("lat", "long", "nombre")

    for row in cursor1.fetchall():
        resultsMapHome.append(dict(zip(columsMap,row)))
     
    mapHomeDf = pd.DataFrame(resultsMapHome)
    for i, row in mapHomeDf.iterrows():
        popupTtext=f"<b> Nombre:</b>{row.nombre}<br>"
        folium.CircleMarker(location=[row.lat,row.long], radius=5, tooltip=popupTtext, fill=True, fill_capacity=.4).add_to(foliumMapHome)
    foliumMapHome.save('templates/mapHome.html')
    return render_template('mapHome.html')

def returnTableName():
    global tableName 
    tempTable = tableName
    return tempTable + "Table"

if __name__=="__main__":
    app.run()
 