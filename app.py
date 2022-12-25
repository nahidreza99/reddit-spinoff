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
    
    posts = []
    i = 1
    for submission in reddit.front.new(limit=20):
        post = {}
        post['subreddit'] = str(submission.subreddit)
        post['user'] = str('u/'+str(submission.author))
        post['name'] = submission.name
        post['created_utc'] = submission.created_utc
        post['title'] = submission.title
        if submission.is_self:
            print(i,': self')
            post['type'] = 'self'
            post['selftext'] = submission.selftext
        elif hasattr(submission, 'is_gallery'):
                print(i,': gallery')
                post['type'] = 'gallery'
                gal = []
                for img_itm in submission.media_metadata:
                    gal.append(str(submission.media_metadata[img_itm]['s']['u']))
                print(gal)
                post['gallery'] = gal
        elif submission.is_reddit_media_domain:
            if(submission.is_video):
                print(i,':video')
                post['type'] = 'video'
                post['url'] = submission.media['reddit_video']['hls_url']
            else:
                print(i,': image')
                post['type'] = 'image'
                post['url'] = submission.url
        else:
            print(i)
            post['type'] = 'meta'
        i+=1
        posts.append(post)

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
    


if __name__ == "__main__":
    app.run(debug=True)



