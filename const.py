import os
import jinja2

""" Constant file paths and files used in app """
JS_FILES = ["../lib/pixi/pixi.js", "../lib/jquery/jquery-1.11.1.min.js", "../js/constants.js"]
NAV_MAIN = [{'url': '/', 'text': 'Home'},{'url': '/play', 'text': 'Play'},{'url': '/create', 'text': 'Create'},{'url': '/extend', 'text': 'Extend'}, {'url': '/top', 'text': 'Top 10 players'}]
createMaze = ["js/mazeMaker.js", "js/mazeGrid.js"]
playMaze = ["js/displayGrid.js"]
editMaze = ["../js/edit.js","../js/mazeGrid.js", "../js/mazeMaker.js"]
CSS_FILE = "../css/main.css"
ICON = "../img/favicon.ico"
JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__) + "/templates"),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)
