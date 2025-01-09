from flask import Flask, request, jsonify
from flask_cors import CORS
import websocket
import os
import random
import asyncio
import threading
import time
import string
import json

app = Flask(__name__)
CORS(app)

def update_history(data):
    with open('database/messages/history.txt', 'r') as ahy:
        dmessages = json.load(ahy)
    dmessages.append(data)
    dmessages = dmessages[-50:]
    with open('database/messages/history.txt', 'w') as nhy:
        json.dump(dmessages, nhy)


def create_user(username, password, uid, token):
    data = {
        "username": username,
        "password": password,
        "token": token,
        "uid": uid,
        "avatar": "None"
    }
    with open(f"database/users/{uid}.json", "w") as base:
        json.dump(data, base)
        #print("fonr")

def update_avatar(url, uid, token):
    with open(f"database/users/{uid}.json", "r+") as av:
        data = json.load(av)
        if data["token"] == token:
            ##print(data)
            data["avatar"] = url
            av.seek(0)
            av.truncate()
            json.dump(data, av)
           
def update_username(new_username, uid, token):
    with open(f"database/users/{uid}.json", "r+") as av:
        data = json.load(av)
        if data["token"] == token:
            ##print(data)
            data["username"] = new_username
            av.seek(0)
            av.truncate()
            json.dump(data, av)        

@app.route('/v1/get/avatar', methods=['POST'])
def avtar():
    data = request.json
    uid = data['uid']
    try:
        with open(f'database/users/{uid}.json') as d:
            uav = json.load(d)
        data = {
            'avatar': uav["avatar"],
        }
        return jsonify(data)
    except:
        return "error"    
        
@app.route('/v1/create', methods=['POST'])
def create():
    if request.method == 'POST':
        
        uid = ''.join(str(random.randint(0, 9)) for _ in range(12))
        lwc, upc = string.ascii_lowercase, string.ascii_uppercase
        star= ''.join(random.choice(upc) for _ in range(3))
        mid = ''.join(random.choice(string.ascii_lowercase + string.ascii_uppercase) for _ in range(16))
        last = ''.join(random.choice(string.ascii_lowercase + string.ascii_uppercase) for _ in range(16))
        token = star + mid + "." + last
        #print("doone")
        
        try:
            data = request.json
            username = data['username']
            password = data['password']
            create_user(username, password, uid, token)
            to_send = {
                "token": token,
                "uid": uid
            }
            return jsonify(to_send)
        except:
            return "Failed"
    else:
        return 'You Are Not Allowed'

#avtar update
@app.route('/v1/avatar/update', methods=["GET", "POST"])
def av_update():
    if request.method == "POST":
        av = request.json
        ##print(av)
        avatar = av["avatar"]
        token = av["avtoken"]
        uid = av["avuid"]
        update_avatar(avatar, uid, token)
        return "ok"
    else:
        return "Not Permitted"
        
ws = websocket.WebSocketApp("wss://socket.styy.me")
@app.route('/v1/socket/check', methods=["POST"])
def csockey():
    if ws.sock.connected:
        return "ok"
    else:
       reconnect()
       return "ok"
@app.route('/v1/chat/send', methods=["POST"])
def send():
    data = request.json
    m_id = ''.join(str(random.randint(0, 9)) for _ in range(7))
    uid = data["uid"]
    fmsg = data["msg"]
    try:
        with open(f"database/users/{uid}.json", "r") as user:
            udata = json.load(user)
        data = {
             "username": udata["username"],
             "avatar": udata["avatar"],
             "msg": fmsg,
             "msg_id": m_id
        }
        try:
            ws.send(json.dumps(data))
            print("snet")
        except Exception as e:
            print(e)
            reconnect()
            ws.send(json.dumps(data))
        update_history(data)
        return "ok"
    except:
        return "smth went wrong wdhstadjc"
@app.route('/v1/chat/history', methods=['POST'])
def load_messages():
    if request.method != "POST":
        abort(404)
    else: pass
    offset = int(request.args.get('offset', 0))
    limit = int(request.args.get('limit', 100))
    with open('database/messages/history.txt', 'r') as history:
        paginated_messages = json.load(history)[offset:offset + limit]
    return jsonify(paginated_messages)
@app.route('/v1/edit/username', methods=['POST'])
def uedit():
    data = request.json
    try:
        uid = data["uid"]
        token = data["token"]
        new_username = data["usern"]
        update_username(new_username, uid, token)
        return "ok"
    except:
         return "error"      
@app.route('/v1/check/data', methods=['POST'])
def check():
    data = request.json
    
    if data["check"] == "avatar":
         with open(f"database/users/{data['uid']}.json", "r") as data:
             udata = json.load(data)
         if udata["avatar"] != "None":
             return "yep"
             ##print("sent yep")
         else:
             return "nope"
             ##print("sent nope")
def reconnect():
      threading.Thread(target=websocket).start()      
def websocket():
    ws.run_forever(reconnect=3)
threading.Thread(target=websocket).start()

