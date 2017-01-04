from google.appengine.ext import ndb

class User(ndb.Model):
	"""Holds the total score for a given user"""
	user = ndb.UserProperty(required=True)
	total_score = ndb.IntegerProperty(required=True)
