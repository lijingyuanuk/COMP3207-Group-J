from google.appengine.ext import ndb
import webapp2
import logging
from const import *
from models.maze import Maze

class NameValidator(webapp2.RequestHandler):
	#used to check whether or not the name of a maze is NameValidator
	def post(self):

		posts = self.request.POST.items()

		#the name is the only posted item
		name = posts[0][1]

		#query for mazes named like this
		query = Maze.query(Maze.name == name)
		results = query.fetch()

		valid = "false"
		#if there is any maze with this name, the name is not valid
		if len(results) == 0:
			valid = "true"

		output = "{\"valid\" : \""+ valid +"\" }"
		self.response.write(output)