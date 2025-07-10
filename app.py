import os
from flask import Flask, render_template, send_from_directory, redirect, url_for

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return send_from_directory('', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('', path)

@app.route('/css/<path:path>')
def serve_css(path):
    return send_from_directory('css', path)

@app.route('/js/<path:path>')
def serve_js(path):
    return send_from_directory('js', path)

@app.route('/images/<path:path>')
def serve_images(path):
    return send_from_directory('images', path)

@app.route('/pages/<path:path>')
def serve_pages(path):
    return send_from_directory('pages', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)