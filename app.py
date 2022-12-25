from flask import Flask, request, render_template,redirect,url_for,jsonify, session
import datetime
import requests
import praw ,json
from variables import   obj
app = Flask(__name__)

reddit=obj()


@app.route("/authorize")
def authorize():
    code = request.args.get('code')
    
    authorization_code = reddit.auth.authorize(code)
    user = reddit.user.me()
    print(user)
    print(type(user))
    if user:

        return redirect(url_for('home'))
    else:
        return "unsuccesful"

@app.route("/")
def home():
    loginURL = reddit.auth.url(scopes=["*"], state="...", duration="permanent")

    return render_template('index.html', **locals())


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
    return dict(reddit=reddit)
    
def check_gallery(submission):
    if hasattr(submission, 'is_gallery'):
        return True
    else:
        return False

def get_urls(submission):
    gal = []
    for img_itm in submission.media_metadata:
        gal.append(str(submission.media_metadata[img_itm]['s']['u']))
    return enumerate(gal)

def get_submission():
    all_id = [submission.id for submission in reddit.front.new(limit=20)]
    fullnames = [f"t3_{id}" for id in all_id]
    print(all_id)
    return enumerate(reddit.info(fullnames=fullnames))
def get_video(submission):
    return submission.media['reddit_video']['hls_url']

if __name__ == "__main__":
    app.run(debug=True)
app.jinja_env.globals.update(check_gallery=check_gallery)
app.jinja_env.globals.update(get_urls=get_urls)
app.jinja_env.globals.update(get_submission=get_submission)
app.jinja_env.globals.update(get_video=get_video)

