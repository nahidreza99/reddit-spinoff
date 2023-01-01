import praw

Client_ID = '5pL7d93G5ZW1FDltt3utFA'
Client_Secret = 'hbBDgd4VVr4VXz1eT-PIjzgaIZjzog'
User_Agent = 'script:com.example.myredditapp:v1.2.3 (by u/testbot)'



def obj():
    reddit = praw.Reddit(
    client_id = 'Iyk7s5_atTdbrkKBGjU-Og',
    client_secret = 'vevcjIFvOdXkVKo51iGukpHdppJ-SQ',
    user_agent=User_Agent,
    redirect_uri='http://127.0.0.1:5000/authorize',
    read_timeout=30
    )
    return reddit

def old_obj(token):
    reddit = praw.Reddit(
    client_id = 'Iyk7s5_atTdbrkKBGjU-Og',
    client_secret = 'vevcjIFvOdXkVKo51iGukpHdppJ-SQ',
    refresh_token=token,
    user_agent=User_Agent,
    read_timeout=30
    
    )
    return reddit