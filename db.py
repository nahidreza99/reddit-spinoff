from flask_sqlalchemy import SQLAlchemy
import datetime

DB = SQLAlchemy()

# Define the "bridge" table for the many-to-many relationship between Playlist and User models
playlist_members = DB.Table('playlist_members',
    DB.Column('playlist_id', DB.Integer, DB.ForeignKey('playlist.id'), primary_key=True),
    DB.Column('user_id', DB.Integer, DB.ForeignKey('user.id'), primary_key=True)
)

playlist_subs = DB.Table('playlist_subs',
    DB.Column('playlist_id', DB.Integer, DB.ForeignKey('playlist.id'), primary_key=True),
    DB.Column('sub_id', DB.Integer, DB.ForeignKey('subs.id'), primary_key=True)
)

# Define a model to represent the database structure
class User(DB.Model):
    id = DB.Column(DB.Integer, DB.Sequence('user_id'), primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    email = DB.Column(DB.String(120), unique=True, nullable=True)
    phone = DB.Column(DB.String(20), unique=True, nullable=True)
    
    # Define one-to-many relationship with Playlist model
    playlists = DB.relationship('Playlist', backref='owner', lazy=True)

# Define the Playlist model
class Playlist(DB.Model):
    id = DB.Column(DB.Integer, primary_key=True)
    name = DB.Column(DB.String(80), nullable=False)
    privacy = DB.Column(DB.Boolean, default=True, nullable=False)
    owner_id = DB.Column(DB.Integer, DB.ForeignKey('user.id'), nullable=False)
    
    # Define many-to-many relationship with User model
    members = DB.relationship('User', secondary='playlist_members', backref='member_playlists')
    
    # Define the subreddit field as an array of strings
    subs = DB.relationship('Subs', secondary='playlist_subs', backref='playlist_subs')

# Define the Subs model
class Subs(DB.Model):
    id = DB.Column(DB.Integer, DB.Sequence('sub_id'), primary_key=True)
    name = DB.Column(DB.String(80), nullable=False)



class Chatbox(DB.Model):
    id = DB.Column(DB.Integer, DB.Sequence('chatbox_id'), primary_key=True)
    message = DB.Column(DB.Text(200), nullable=False)
    created = DB.Column(DB.DateTime, default=datetime.datetime.utcnow)
    owner_id = DB.Column(DB.Integer, DB.ForeignKey('user.id'), nullable=False)