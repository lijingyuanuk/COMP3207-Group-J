from google.appengine.api import users
from google.appengine.ext import ndb
import webapp2
import logging
from const import *
from models.maze import Maze
from models.user import User

class UpdateScore(webapp2.RequestHandler):
	def post(self):
		#called just to update the best score of a maze

		
		posts = self.request.POST.items()

		maze_id = int(posts[0][1])
		maze_key = ndb.Key('Maze', maze_id)
		maze = maze_key.get()

		score = int(posts[1][1])
		
		#if the score is higher than the maze's best score, we must save it as the new best score
		new_best_score = "false"
		if score > maze.best_score:
			maze.best_score = score
			maze.player_best_score = users.get_current_user()
			maze.put()
			new_best_score = "true"

		#if the user is logged in, we must update his total score
		current_user = users.get_current_user()
		if current_user:

			#if the user is already in the User table:
			query = User.query(User.user == current_user) 
			results = query.fetch(1)
			if len(results) > 0:
				results[0].total_score += score
				results[0].put()

			else:
				user = User(user=current_user, total_score=score)
				user.put()

			output = "{\"newBestScore\" : \""+ new_best_score +"\", \"isLogged\" : \"true\" }"
			self.response.write(output)
		else:
			output = "{\"newBestScore\" : \""+ new_best_score +"\", \"isLogged\" : \"false\" }"
			self.response.write(output)
