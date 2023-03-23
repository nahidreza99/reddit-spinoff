import praw

Client_ID = ''
Client_Secret = ''
User_Agent = 'script:com.example.myredditapp:v1.2.3 (by u/testbot)'

 

def obj():
    reddit = praw.Reddit(
    client_id = Client_ID,
    client_secret = Client_Secret,
    user_agent=User_Agent,
    redirect_uri='http://127.0.0.1:5000/authorize',
    )
    return reddit

def old_obj(token):
    reddit = praw.Reddit(
    client_id = Client_ID,
    client_secret = Client_Secret,
    refresh_token=token,
    user_agent=User_Agent
   
    
    )
    return reddit