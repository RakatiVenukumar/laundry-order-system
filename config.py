import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///laundry.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
