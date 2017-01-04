import jinja2
from google.appengine.api import users

# Allows to pass the HTML directly to the template preventing autoescaping it. - Jinja2 environment is currently set to autoescape
a = jinja2.Markup('<a href="%s" id="user-login">%s</a>')

# User authentication handling
def loginPanel(instance, user):
	if user:
		userpanel = (a % (users.create_logout_url(instance.request.uri), "Hello, "+user.nickname()+" | Logout"))
	else:
		userpanel = (a % (users.create_login_url(instance.request.uri), "Login | Sign up"))
	return userpanel
