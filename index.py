from google.appengine.api import users
from google.appengine.ext import ndb
import logging
import os
import webapp2
import jinja2
import copy
from const import *
from login_panel import loginPanel
from controllers.main_page import MainPage
from controllers.play_maze import PlayMaze
from controllers.maze_maker import MazeMaker
from controllers.update_score import UpdateScore
from controllers.maze_edit import MazeExtend
from controllers.top_players import TopPlayers
from controllers.name_validator import NameValidator



application = webapp2.WSGIApplication([
	('/', MainPage),
	('/create', MazeMaker),
	('/play', PlayMaze),
	(r'/play/(\d+)', PlayMaze),
    ('/extend', MazeExtend),
    (r'/extend/(\d+)', MazeExtend),
    ('/updatescore', UpdateScore),
    ('/top', TopPlayers),
    ('/namevalidator', NameValidator)
], debug=True)


