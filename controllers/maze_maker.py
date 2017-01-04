from google.appengine.api import users
from google.appengine.ext import ndb
import webapp2
from const import *
from login_panel import loginPanel
from models.maze import Maze

class MazeMaker(webapp2.RequestHandler):
	def get(self):
		if users.get_current_user():
			user = users.get_current_user()
			query = Maze.query(Maze.author == user, Maze.next_maze == None) #all existing mazes for this user that does not have any "next maze"
			results = query.fetch()
			mazes = []
			for r in results:
				if(r.name != None and len(r.name)!=0):
					mazes.append({'id': r.key.id(), 'name': r.name})
				else:
					mazes.append({'id': r.key.id(), 'name': r.key.id()})

			template_values = {
					"userpanel": loginPanel(self, user),
					"title": "Make Your Own Amazeing Adventure",
					"jsfiles": JS_FILES+createMaze,
					"cssfile": CSS_FILE,
					"navs": NAV_MAIN,
					"icon": ICON,
					"action": self.request.uri,
					"mazes": mazes}
			template = JINJA_ENVIRONMENT.get_template('create.html')
			self.response.write(template.render(template_values))

		else:
			self.redirect(users.create_login_url(self.request.uri))
			
	def post(self):
		#Fancy Database|Storage stuff will go here
		#to perform saving the created maze and maping
		#it in Datastore to proper user
		if users.get_current_user():
			posts = self.request.POST.items()

			#get width and height of created maze
			maze_width = 0
			maze_height = 0
			if posts[0][0] == "width":
				maze_width = int(posts[0][1])
			if posts[1][0] == "height":
				maze_height = int(posts[1][1])

			#len(posts) is always 4 + maze_width * maze_height * 2 (width + height + tileGrid + itemGrid + name + previousMaze)

			#get tile and items grids from post
			tile_grid = []
			for i in range(2, len(posts)/2):
				if posts[i][0].startswith("tiles"): 
					tile_grid.append(posts[i][1])
				else:
					break

			item_grid = []
			for j in range(len(posts)/2, len(posts)-2):
				if posts[j][0].startswith("items"):
					item_grid.append(posts[j][1])
				else:
					break

			#make sure we got the right number of elements
			assert(len(item_grid) == maze_width * maze_height)
			assert(len(item_grid) == maze_width * maze_height)

			#transform ours lists into strings so it can be stored in Datastore
			tiles = ','.join(tile_grid)
			items = ','.join(item_grid)

			maze_name = posts[len(posts)-3][1]
			wholeSeconds = int(posts[len(posts)-1][1])
			
			#create Maze object to store in Datastore
			maze = Maze(author = users.get_current_user(),
						name = maze_name,
						width = maze_width,
						height = maze_height,
						tile_content = tiles,
						item_content = items,
						best_score = 0,
						whole_seconds = wholeSeconds)

			maze_key = maze.put()

			#now, if the user has selected a "previous maze", we have to update it
			prevmaze = posts[len(posts)-2][1];
			if prevmaze != "none":
				prev_maze_id = int(prevmaze)
				prev_maze_key = ndb.Key('Maze', prev_maze_id)
				prev_maze = prev_maze_key.get()
				prev_maze.next_maze = maze_key
				prev_maze_key = prev_maze.put()

				maze.previous_maze = prev_maze_key
				maze.put()


			#output string must be in JSON format so it can be parsed
			output = "{\"redirect\" : \"/create\" }"
			self.response.write(output)
		else:
			#self.redirect(users.create_login_url(self.request.uri))
			#output string must be in JSON format so it can be parsed
			output = "{\"redirect\" : \"" + users.create_login_url(self.request.uri) + "\"  }"
			self.response.write(output)
