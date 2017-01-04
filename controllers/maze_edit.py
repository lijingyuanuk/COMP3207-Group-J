from google.appengine.api import users
from google.appengine.ext import ndb
import webapp2
import copy
from const import *
from login_panel import loginPanel
from models.maze import Maze

#edit
class MazeExtend(webapp2.RequestHandler):
    def pathFix(self, paths):
        fixed_paths = copy.deepcopy(paths)
        for i in range(len(paths)):
            fixed_paths[i] = "../" + paths[i]
        return fixed_paths

    def get(self, *args):
        if (len(args) > 0):
            # in this case, URL is '/extend/X'
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
                        "title": "Extend an Existing Maze",
                        "jsfiles": JS_FILES+editMaze,
                        "cssfile": CSS_FILE,
                        "navs": NAV_MAIN,
                        "action": self.request.uri,
                        "icon": ICON,
                        "mazes": mazes}
                template = JINJA_ENVIRONMENT.get_template('create.html')
                self.response.write(template.render(template_values))

            else:
                self.redirect(users.create_login_url(self.request.uri))
            
        else:
            # in this case, URL is '/extend'
            # so, we have to select which maze to extend
            query = Maze.query().order(Maze.date_created) #all existing mazes
            results = query.fetch()

            mazes = []
            for r in results:
                if(r.name != None and len(r.name)!=0):
                    mazes.append({'id': r.key.id(), 'name': r.name, 'author': r.author})
                else:
                    mazes.append({'id': r.key.id(), 'name': r.key.id(), 'author': r.author})
            
            user = users.get_current_user()
            template_values = {
                    "userpanel": loginPanel(self, user),
                    "title": "Select maze to edit",
                    "jsfiles": JS_FILES,
                    "navs": NAV_MAIN,
                    "cssfile": CSS_FILE,
                    "icon": ICON,
                    "mazes": mazes}
            template = JINJA_ENVIRONMENT.get_template('select-edit.html')
            self.response.write(template.render(template_values))


    def post(self):
        #called to return the maze contents
        posts = self.request.POST.items()

        maze_id = -1;
        if posts[0][0] == "mazeId":
            maze_id = int(posts[0][1])

        maze_key = ndb.Key('Maze', maze_id)
        maze = maze_key.get()
        
        seconds = maze.whole_seconds

        next_maze = "none"
        if (maze.next_maze != None):
            next_maze = str(maze.next_maze.id())

        #output string must be in JSON format so it can be parsed
        output = "{\"width\" : \"" + str(maze.width) + "\" , \"height\" : \"" + str(maze.height) + "\" , \"tiles\": \"[" + maze.tile_content + "]\" , \"items\" : \"[" + maze.item_content + "]\" , \"nextMaze\" : \"" + next_maze + "\", \"whole_seconds\": \"" + str(seconds) + "\", \"name\": \"" + maze.name + "\"}" 
        self.response.write(output)
#edit