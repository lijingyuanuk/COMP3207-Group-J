from google.appengine.api import users
import webapp2
from const import *
from login_panel import loginPanel


class MainPage(webapp2.RequestHandler):
	def get(self):
		user = users.get_current_user()
		template_values = {
				"userpanel": loginPanel(self, user),
				"title": "The Amazeing Adventures",
				"jsfiles": [],
				"cssfile": CSS_FILE,
				"navs": NAV_MAIN,
				"icon": ICON}
		template = JINJA_ENVIRONMENT.get_template('start.html')
		self.response.write(template.render(template_values))
