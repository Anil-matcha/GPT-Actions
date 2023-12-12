from flask import Flask,jsonify,request,session,render_template,redirect,url_for,make_response,send_from_directory,send_file
from flask_login import login_required, login_user, current_user, logout_user
from database import *
import string, secrets
import random
from requests_oauthlib import OAuth2Session
import urllib.parse
import os
from urllib.parse import urlparse, parse_qs
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

GOOGLE_AUTH_BASE_URL = "https://accounts.google.com/o/oauth2/v2/auth"

GOOGLE_SCOPE = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid"
]

DOMAIN_URL = "https://9979-122-171-21-142.ngrok-free.app"

@app.route('/verify_token/<slug>', methods=['POST'])
def verify_token(slug):
    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for i in range(8))
    getUser = User.query.filter_by(admin_id=slug).order_by(User.id.desc()).first()
    getUser.token = token
    db.session.commit()
    return jsonify(access_token=token)

@app.route('/get_greeting', methods=['GET'])
def get_greeting():
    token = request.headers['Authorization'].split(" ")[1]
    if User.query.filter_by(token=token).first()!=None:
        hello_list = ['Good morning','Good afternoon','How do you do?','What’s new?','Well, look who it is!','How have you been?','What’s up buttercup?','What’s up doc?','How are you?','What’s up','How are you going?','Yo, what’s up?','Where’ve you been?','Whassup?','Hey man','Hey dude','How are you guys?','Oi!','Mate!','Hey, what’s up','Cheers','You right?','How ya goin?','How are ya?','Howdy','What’s going on?','What do you know?','How’s this weather?']
        return random.choice(hello_list),200
    else:
        return "Invalid credentials",400

@app.route('/get_credentials', methods=['POST'])
def get_credentials():
    data = request.get_json()
    if "id" in data:
        id = data['id']
        getAdmin = Admin.query.filter_by(id=id).first()
        redirect_uri = DOMAIN_URL + "/login"
        google = OAuth2Session(
            getAdmin.google_client_id, scope=GOOGLE_SCOPE, redirect_uri=redirect_uri)
        login_url, state = google.authorization_url(GOOGLE_AUTH_BASE_URL)
        getAdmin.google_login_url = login_url
        db.session.commit()
    else:
        adminId = secrets.token_urlsafe(12)
        alphabet = string.ascii_letters + string.digits
        client_id = ''.join(secrets.choice(alphabet) for i in range(8))
        client_secret = ''.join(secrets.choice(alphabet) for i in range(8))
        google_client_id = data["googleId"]
        google_client_secret = data["googleSecret"]
        url_host = urllib.parse.urlsplit(request.url).hostname
        redirect_uri = DOMAIN_URL + "/login"
        google = OAuth2Session(
            google_client_id, scope=GOOGLE_SCOPE, redirect_uri=redirect_uri)
        login_url, state = google.authorization_url(GOOGLE_AUTH_BASE_URL)
        getAdmin = Admin(id=adminId,client_id=client_id,client_secret=client_secret,google_login_url=login_url,google_client_id=google_client_id,google_client_secret=google_client_secret)
        db.session.add(getAdmin)
        db.session.commit()
    return jsonify(id=getAdmin.client_id,secret=getAdmin.client_secret,adminId=getAdmin.id)

@app.route('/get_login_url', methods=['GET'])
def get_login_url():
    id = request.args.get('id')
    getAdmin = Admin.query.filter_by(id=id).first()
    return jsonify(getAdmin.google_login_url)

@app.route('/oauth/<slug>', methods=['GET'])
def oauth_slug(slug):
    redirect_uri = request.args.get('redirect_uri')
    redirect_uri += "?state="+request.args.get('state')+"&code="+request.args.get('client_id')
    url = DOMAIN_URL + "/oauth/"+slug+"?myRedirect="+redirect_uri
    return redirect(url)

@app.route("/login", methods=['GET'])
def login():
        adminId = request.args.get("id")
        if request.args.get("url") != None:
            request_url = request.args.get("url")
            parsed_url = urlparse(request_url)
            query_params = parse_qs(parsed_url.query)
            code = query_params.get('code', [None])[0]
        else:
            request_url = request.url
            code = None
        url_host = urllib.parse.urlsplit(request.url).hostname
        redirect_uri = "https://"+url_host+"/google_callback"
        getAdmin = Admin.query.filter_by(id=adminId).first()
        redirect_uri = DOMAIN_URL + "/login"
        google = OAuth2Session(
            getAdmin.google_client_id, scope=GOOGLE_SCOPE, redirect_uri=redirect_uri)
        token_url = "https://www.googleapis.com/oauth2/v4/token"
        welcome = False
        google.fetch_token(token_url, client_secret=getAdmin.google_client_secret,
                            code=code)
        response = google.get(
            'https://www.googleapis.com/oauth2/v1/userinfo').json()
        email = response["email"].lower()
        googleId = str(response["id"])
        name = response["name"]
       
        getUser = User.query.filter_by(email=email).first()
        if getUser == None:
            getUser = User(email=email,google_id=googleId, name=name, admin_id=getAdmin.id)
            db.session.add(getUser)
            db.session.commit()
        else:
            getUser.google_id = googleId
            db.session.commit()
        login_user(getUser, remember=True)
        return "Success",200

if __name__ =='__main__':  
    app.run(host="0.0.0.0", debug = True, port=5000)
