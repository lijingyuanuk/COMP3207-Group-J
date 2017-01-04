from google.appengine.api import users
from google.appengine.ext import ndb
import webapp2
from const import *
from login_panel import loginPanel
from models.user import User

class TopPlayers(webapp2.RequestHandler):
	def get(self):

		query = User.query().order(-User.total_score) #users sorted by their total score
		results = query.fetch(10)

		players = []
		for r in results:
			players.append({'nickname': r.user.nickname(), 'score': r.total_score})		

		user = users.get_current_user()
		template_values = {
				"userpanel": loginPanel(self, user),
				"title": "The Amazeing Top Players",
				"jsfiles": JS_FILES,
				"cssfile": CSS_FILE,
				"navs": NAV_MAIN,
				"action": self.request.uri,
				"players": players}
		template = JINJA_ENVIRONMENT.get_template('top.html')
		self.response.write(template.render(template_values))