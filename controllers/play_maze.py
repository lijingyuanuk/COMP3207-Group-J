from google.appengine.api import users
from google.appengine.ext import ndb
import webapp2
import copy
from const import *
from login_panel import loginPanel
from models.maze import Maze

class PlayMaze(webapp2.RequestHandler):
	def pathFix(self, paths):
		fixed_paths = copy.deepcopy(paths)
		for i in range(len(paths)):
			fixed_paths[i] = "../" + paths[i]
		return fixed_paths

	def get(self, *args):
		if (len(args) > 0):
			# in this case, URL is '/play/X'. 
			# If we use the current JS files path, the server will look for them in a directory named 'play' instead of the root directory
			# because of this, we need to fix the paths
			user = users.get_current_user()
			template_values = {
					"userpanel": loginPanel(self, user),
					"title": "Be Amazed!",
					"jsfiles": self.pathFix(JS_FILES + playMaze),
					"cssfile": "../"+CSS_FILE,
					"icon": "../"+ICON,
					"navs": NAV_MAIN
					}
			template = JINJA_ENVIRONMENT.get_template('play.html')
			self.response.write(template.render(template_values))

		else:
			# in this case, URL is '/play'
			# so, we have to select in which maze to play
			query = Maze.query(Maze.previous_maze == None).order(Maze.date_created) #mazes that dont have any previous mazes ordered by their date of creation
			results = query.fetch()

			mazes = []
			for r in results:
				player_best_score = '--'
				if r.player_best_score != None:
					player_best_score = r.player_best_score
				if(r.name != None and len(r.name)!=0):
					mazes.append({'id': r.key.id(), 'name': r.name, 'best_score': r.best_score, 'player_best_score': player_best_score})
				else:
					mazes.append({'id': r.key.id(), 'name': r.key.id(), 'best_score': r.best_score, 'player_best_score': player_best_score})
				
			user = users.get_current_user()
			template_values = {
					"userpanel": loginPanel(self, user),
					"title": "Select Your Adventure",
					"jsfiles": JS_FILES,
					"navs": NAV_MAIN,
					"cssfile": CSS_FILE,
					"icon": ICON,
					"mazes": mazes}
			template = JINJA_ENVIRONMENT.get_template('select.html')
			self.response.write(template.render(template_values))

	def post(self):
		#called to return the maze contents
		posts = self.request.POST.items()

		maze_id = -1
		if posts[0][0] == "mazeId":
			maze_id = int(posts[0][1])

		maze_key = ndb.Key('Maze', maze_id)
		maze = maze_key.get()
		
		seconds = maze.whole_seconds

		next_maze = "none"
		if (maze.next_maze != None):
			next_maze = str(maze.next_maze.id())

		best_score = "0" #default best score for when the maze has never been played before
		player_best_score = "none"
		if (maze.best_score != None):
			best_score = str(maze.best_score)
		if (maze.player_best_score != None):
			player_best_score = maze.player_best_score.nickname()

		#output string must be in JSON format so it can be parsed
		output = "{\"width\" : \"" + str(maze.width) + "\" , \"height\" : \"" + str(maze.height) + "\" , \"tiles\": \"[" + maze.tile_content + "]\" , \"items\" : \"[" + maze.item_content + "]\" , \"nextMaze\" : \"" + next_maze + "\", \"whole_seconds\": \"" + str(seconds) + "\", \"bestScore\" : \""+ best_score +"\", \"playerBestScore\" : \""+ player_best_score +"\"}"
		self.response.write(output)
