# reddit-spinoff
It is a spinoff of Reddit. It enables users to browse Reddit with minimal interface. 
Video Demonstration : https://www.youtube.com/watch?v=2Lq-JaPNWwg

# Library
PRAW library is used to fetch APIS of reddit. Read their documentation https://praw.readthedocs.io/en/latest/index.html

# Installation
1. Clone the repository.
2. Open with Vscode.
3. Create virtual environment:
    1. ctrl + shift + p
    2. Select "Python: Create environment".
    3. Select "python 3.10" as the interpreter
    4. Open terminal: ctrl + `
    5. Activate virtual environment: ```#source .venv/bin/activate```
4. Install the requirements: ```#pip3 install -r "requirements.txt"```

# Getting Started
1. Go to https://www.reddit.com/prefs/apps
2. Create new reddit web app.
3. Use 'http://127.0.0.1:5000/authorize' the redirect_uri. (You can use your preferred port also)
4. Open variables.py. 
5. Use your reddit application client id and secret as 'Client_ID' and 'Client_Secret'. Save.
6. Run the application: ```#python -m app run```