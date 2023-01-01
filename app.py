from flask import Flask, request, render_template,redirect,url_for,jsonify, session
import datetime
import requests
import praw ,json
import PIL
import urllib
from variables import   obj,old_obj

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8zfuad##@3/'

reddit=None
loginURL=None


@app.route("/<string:t>/<string:red>")
def mainpage(t,red):

    front = True
    sub = ''
    if red!='all':
        front = False
        sub = red
    return render_template('index.html', **locals())

@app.route("/")
def home():
    global reddit
    if 'refresh_token' in session:
        
        reddit=old_obj(session['refresh_token'])
    else:
        
        reddit=obj()
        global loginURL
        loginURL = reddit.auth.url(scopes=["*"], state="...", duration="permanent")
    return redirect('/r/all')

@app.route("/logout")
def logout():
    session.clear()
    global reddit
    reddit=None
    return redirect('/')

@app.route("/authorize")
def authorize():
    code = request.args.get('code')
    
    authorization_code = reddit.auth.authorize(code)
    print('refresh token',type(authorization_code))
    #print(type(authorization_code))
    
    user = reddit.user.me()
    # if user:
    #     #session['user']=str(user)
    #     # session['loggedin']=True
    #     #session['access_token']=reddit.auth.access_token
    #     #print(reddit.expires_at)
    #     print(user)
    #     print(type(user))
    if user:
        session['refresh_token']=authorization_code
        print(session['refresh_token'])
        #print(reddit.expires_at)
        return redirect('/r/all')
    else:
        return "unsuccesful"

@app.route('/api/search-subreddits', methods=['POST','GET'])
def search_subreddits():
  # Get the search query from the request
  query = request.form['query']

  # Search for subreddits using PRAW
  subreddits = reddit.subreddits.search(query,limit=10)

  # Create a list of subreddit names
  subreddit_names = [subreddit.display_name for subreddit in subreddits]
  print(subreddit_names)
  # Return the list of subreddit names as a JSON response
  return  jsonify({'subreddit_name': subreddit_names})

@app.context_processor
def inject_user():
    
    #json_string = json.dumps(reddit_dict)
    return dict(reddit=reddit,loginURL=loginURL)

def get_submission(isFront, sub):
    if(isFront):
        all_id = [submission.id for submission in reddit.front.hot(limit=30)]
    else:
        all_id = [submission.id for submission in reddit.subreddit(sub).hot(limit=30)]
    fullnames = [f"t3_{id}" for id in all_id]
    print(all_id)
    return enumerate(reddit.info(fullnames=fullnames))

def check_gallery(submission):
    gallery = False
    gallery = submission.__dict__.get('is_gallery', False)
    print(gallery)
    return gallery

def get_urls(submission):
    gal = []
    for img_itm in submission.media_metadata:
        try:
            gal.append(str(submission.media_metadata[img_itm]['s']['u']))
        except KeyError as e:
            print('gallery error: ', '[reddit: ', submission.subreddit,'title: ', submission.title,']')
            print(e)
    return enumerate(gal)

def get_video(submission):
    return submission.media['reddit_video']['hls_url']

def check_url(submission_url):
    meta_url = submission_url
    url_split = meta_url.split('/')
    prefix = url_split[2]
    if prefix == 'www.reddit.com':
        return 'reddit'
    else:
        return 'others'

def get_upvote(submission):
    return submission.upvote-submission.downvote

def get_commentsLength(submission):
    return len(submission.comments)

def curve_number(num):
    if num>1000:
        return str(round(float(num/1000),1))+'k'
    else:
        return str(num)

def get_avatar(redditor):
    return reddit.redditor(str(redditor)).icon_img

def get_karma(redditor):
    return reddit.redditor(str(redditor)).comment_karma + reddit.redditor(str(redditor)).link_karma

def get_reddit_age(redditor):
    return reddit.redditor(str(redditor)).created_utc

def is_crosspost(submission):
    print(submission.name)
    crosspost=False
    parent = submission.__dict__.get('crosspost_parent', None)
    if parent != None:
        id = parent.split('_')
        sub = []
        sub.append(reddit.submission(id[1]))
        print('parent: ', sub)
        crosspost = True
    else:
        sub = None
    return sub

if __name__ == "__main__":
    app.run(debug=True)
app.jinja_env.globals.update(check_gallery=check_gallery)
app.jinja_env.globals.update(get_urls=get_urls)
app.jinja_env.globals.update(get_submission=get_submission)
app.jinja_env.globals.update(get_video=get_video)
app.jinja_env.globals.update(check_url=check_url)
app.jinja_env.globals.update(get_commentsLength=get_commentsLength)
app.jinja_env.globals.update(get_upvote=get_upvote)
app.jinja_env.globals.update(curve_number=curve_number)
app.jinja_env.globals.update(get_avatar=get_avatar)
app.jinja_env.globals.update(get_karma=get_karma)
app.jinja_env.globals.update(is_crosspost=is_crosspost)
app.jinja_env.globals.update(get_reddit_age=get_reddit_age)