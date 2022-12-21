from flask import Flask, request, render_template
import requests
import praw
app = Flask(__name__)

Client_ID = '5pL7d93G5ZW1FDltt3utFA'
Client_Secret = 'hbBDgd4VVr4VXz1eT-PIjzgaIZjzog'
User_Agent = 'script:com.example.myredditapp:v1.2.3 (by u/testbot)'

reddit = praw.Reddit(
    client_id = 'Iyk7s5_atTdbrkKBGjU-Og',
    client_secret = 'vevcjIFvOdXkVKo51iGukpHdppJ-SQ',
    user_agent=User_Agent,
    redirect_uri='http://127.0.0.1:5000/authorize',
)


@app.route("/authorize")
def authorize():
    code = request.args.get('code')
    authorization_code = reddit.auth.authorize(code)
    user = reddit.user.me()
    return 'login successful: '+str(user)

@app.route("/")
def home():
    loginURL = reddit.auth.url(scopes=["*"], state="...", duration="permanent")
    return render_template('index.html', **locals())




