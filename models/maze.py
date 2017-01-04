from google.appengine.ext import ndb

class Maze(ndb.Model):
	"""Models an individual maze"""
	name = ndb.StringProperty(required=False, indexed=True)
	author = ndb.UserProperty(required=True)
	date_created = ndb.DateTimeProperty(auto_now_add=True, indexed=True)
	width = ndb.IntegerProperty(required=True)
	height = ndb.IntegerProperty(required=True)
	previous_maze = ndb.KeyProperty(required=False)
	next_maze = ndb.KeyProperty(required=False)
	whole_seconds = ndb.IntegerProperty(required=True)
	best_score = ndb.IntegerProperty(required=False)
	player_best_score = ndb.UserProperty(required=False)

	#NOTE: StringProperty allows only up to 500 characters. If you need more, use TextProperty
	tile_content = ndb.TextProperty(required=True)
	item_content = ndb.TextProperty(required=True)