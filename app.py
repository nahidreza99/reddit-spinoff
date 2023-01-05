from flask import Flask, request, render_template,redirect,url_for,jsonify, session
from datetime import datetime
import requests
import praw ,json
import PIL
import urllib
from variables import   obj,old_obj
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
from sqlalchemy.orm import aliased
# from flask_session import Session


app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8zfuad##@3/'
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

with app.app_context():
    db=SQLAlchemy(app)
    
  
user_playlist  = db.Table('user_playlist',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('playlist_id', db.Integer, db.ForeignKey('playlist.id'))
)
subreddit_playlist  = db.Table('subreddit_playlist',
    db.Column('playlist_id', db.Integer, db.ForeignKey('playlist.id')),
    db.Column('subreddit_id', db.Integer, db.ForeignKey('subreddit.id'))
)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String(30),unique=True,nullable=False)
    owns= db.relationship('Playlist',backref='owner')
    joined= db.relationship('Playlist',secondary=user_playlist,backref='members')
    def __repr__(self):
	    return '<User %r>' % self.name 

class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    privacy = db.Column(db.Boolean, default=True, nullable=False)
    owner_id = db.Column(db.Integer,db.ForeignKey('user.id'))
    has = db.relationship('Subreddit',secondary=subreddit_playlist,backref='belongs')

    def __repr__(self):
	    return '<Playlist %r>' % self.name + '<Owner %r>' % self.owner 
    
class Subreddit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String(50),nullable=False)
    def __repr__(self):
	    return '<Subreddit %r>' % self.name 
    

class Chatbox(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner = db.Column(db.String(80),  nullable=False)
    message = db.Column(db.Text(200), nullable=False)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    def __repr__(self):
	    return '<user  %r>' % self.owner + '<messsge  %r>' % self.message

reddit=None
loginURL=None


@app.route("/<string:t>/<string:red>")
def mainpage(t,red):
    global reddit
    if 'refresh_token' in session:
        try:
            reddit=old_obj(session['refresh_token'])
        except:
            print('exxor 3 ')
            return redirect('/logout')
        
    else:
        
        reddit=obj()
        global loginURL
        try:
            loginURL = reddit.auth.url(scopes=["*"], state="...", duration="permanent")
        except:
            print('exxor 2')
            
    front = True
    sub = ''
    if red!='all':
        front = False
        sub = red
    return render_template('index.html', **locals())


@app.route("/add_to_playlist/<int:id>/<string:sub>",methods=['POST','GET'])
def add_to_playlist(id,sub):
    playlist= Playlist.query.filter_by(id=id).first()
    subreddit= Subreddit.query.filter_by(name=sub).first()
    if subreddit==None:
        subr=Subreddit(name=sub)
        db.session.add(subr)
        db.session.commit()
        playlist.has.append(subr)
    else:
        playlist.has.append(subreddit)
    db.session.commit()

    return redirect('/')
    # return jsonify({'status': 'OK'})


@app.route("/add_mod",methods=['POST','GET'])
def add_mod():
 # Get the search query from the request
  query = request.form['query']
  if query:
    list=Playlist(name=query,owner_id=int(session['user_id']))
    db.session.add(list)
    db.session.commit()
  
  return  jsonify({'query': str(query)})
@app.route("/get_subs/<int:id>",methods=['POST','GET'])
def get_subs(id):
    a = aliased(subreddit_playlist)
    subs=Subreddit.query.join(a).filter(a.c.playlist_id ==int(id)).all()
    list=[]
    for i in subs:
        list.append(i.name)
    return jsonify({'res':'OK','subnames':list})

@app.route("/remove/<string:subs>/<int:id>",methods=['POST','GET'])
def remove_subs(subs,id):
    playlist=Playlist.query.filter_by(id=id).first()
    
    subreddit=Subreddit.query.filter_by(name=subs).first()
    subreddit.belongs.remove(playlist)
    db.session.commit()
   
    return jsonify({'res':'OK'})


@app.route("/send_msg",methods=['POST','GET'])
def send_msg():
 # Get the search query from the request
 
  query = request.form['query']
  if query and 'user' in session:
    list=Chatbox(message=query,owner=session['user'])
    db.session.add(list)
    db.session.commit()
    return  jsonify({'res':'OK'})
  else:
    return  jsonify({'res':'KO'})
@app.route("/get_msg",methods=['POST','GET'])
def get_msg():
    my_list=get_chats()
    data = [{attr: getattr(obj, attr) for attr in ['created', 'id', 'owner','message']} for obj in my_list]
    #print(data)
    return jsonify({'res':data})

@app.route("/update_msg/<int:id>",methods=['POST','GET'])
def update_msg(id):
    query = request.form['query']
    print('got here ',query)
    if query and 'user' in session:
        msg=Chatbox.query.filter_by(id=id).first()
        msg.message=query
        db.session.commit()
    return jsonify({'res':'OK'})

@app.route("/")
def home():

    return redirect('/r/all')

@app.route("/logout")
def logout():
    session.clear()
    global reddit
    reddit=None
    return redirect('/')




@app.route("/authorize")
def authorize():
    try:
        code = request.args.get('code')
        authorization_code = reddit.auth.authorize(code)
    except:
        print('exxor 1 ')
        return redirect('/')
    #print('refresh token',type(authorization_code))
    ##print(type(authorization_code))
    
    username = str(reddit.user.me())
    print('successfull auth of :',username,type(username))
 
        
    if username:
        session['refresh_token']=authorization_code
        session['user']=username
        dbuser= User.query.filter(User.name==username).first()
        if dbuser==None:
            newuser=User(name=username)
            db.session.add(newuser)
            db.session.commit()
            session['user_id']=newuser.id
        else:
            session['user_id']=dbuser.id
        #session['username']=username
        #print(session['refresh_token'])
        ##print(reddit.expires_at)
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
  #print(subreddit_names)
  # Return the list of subreddit names as a JSON response
  return  jsonify({'subreddit_name': subreddit_names})

@app.context_processor
def inject_user():
    
    #json_string = json.dumps(reddit_dict)
    return dict(reddit=reddit,loginURL=loginURL)

def get_submission(isFront, sub):
    try:

        if(isFront):
            all_id = [submission.id for submission in reddit.front.hot(limit=1)]
        else:
            all_id = [submission.id for submission in reddit.subreddit(sub).hot(limit=1)]
    except KeyError as e :
        print('error 5 ',e)
        return redirect('/')
    fullnames = [f"t3_{id}" for id in all_id]
    #print(all_id)
    return enumerate(reddit.info(fullnames=fullnames))

def check_gallery(submission):
    gallery = False
    try:
        gallery = submission.__dict__.get('is_gallery', False)
    except:
        print('error 66')
        return redirect('/')
    #print(gallery)
    return gallery

def get_urls(submission):
    gal = []
    for img_itm in submission.media_metadata:
        try:
            gal.append(str(submission.media_metadata[img_itm]['s']['u']))
        except KeyError as e:
            print('error 77',e)
            print('gallery error: ', '[reddit: ', submission.subreddit,'title: ', submission.title,']')
            
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
    #print(submission.name)
    crosspost=False
    parent = submission.__dict__.get('crosspost_parent', None)
    if parent != None:
        id = parent.split('_')
        sub = []
        sub.append(reddit.submission(id[1]))
        #print('parent: ', sub)
        crosspost = True
    else:
        sub = None
    return sub
def get_mods(id):
    list = Playlist.query.filter(Playlist.owner_id==int(id)).all()
    print(list)
    return list
def get_chats():
    list = Chatbox.query.order_by(desc(Chatbox.id)).all()
    return list

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
app.jinja_env.globals.update(get_mods=get_mods)
app.jinja_env.globals.update(get_chats=get_chats)