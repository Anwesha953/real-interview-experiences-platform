from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3

app = Flask(__name__, static_folder="../frontend", static_url_path="")
CORS(app, resources={r"/*": {"origins": ["https://interviewvault-sigma.vercel.app"]}})

def get_db():
    conn = sqlite3.connect("interview_platform.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/health")
def health():
    return jsonify({
        "status": "ok",
        "message": "Interview platform backend is working"
    })

@app.route("/add", methods=["POST"])
def add_post():
    data = request.get_json()

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO posts (company, role, question1, answer, reaction)
        VALUES (?, ?, ?, ?, ?)
    """, (
        data.get("company",""),
        data["role"],
        data["question1"],
        data["answer"],
        data["reaction"]
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Post added successfully"})

@app.route("/posts", methods=["GET"])
def get_posts():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT company, role, question1, answer, reaction FROM posts")
    posts = cursor.fetchall()

    conn.close()

    posts_list = [dict(post) for post in posts]
    return jsonify(posts_list)

if __name__ == "__main__":
    app.run(debug=True)