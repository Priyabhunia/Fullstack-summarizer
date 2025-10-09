# import sqlite3

# def init_db():
#     conn = sqlite3.connect('summarizer.db')
#     c = conn.cursor()
#     # Users table
#     c.execute('''CREATE TABLE IF NOT EXISTS users (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         email TEXT UNIQUE NOT NULL,
#         password TEXT NOT NULL
#     )''')
#     # Summaries table
#     c.execute('''CREATE TABLE IF NOT EXISTS summaries (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         original_text TEXT NOT NULL,
#         summary TEXT NOT NULL,
#         user_id INTEGER,
#         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#         FOREIGN KEY (user_id) REFERENCES users (id)
#     )''')
#     conn.commit()
#     conn.close()

# def get_db_connection():
#     conn = sqlite3.connect('summarizer.db')
#     conn.row_factory = sqlite3.Row  # Returns rows as dictionaries
#     return conn

# if __name__ == '__main__':
#     init_db()  # Run once to create the database



import sqlite3


def init_db():
    conn = sqlite3.connect('summarizer.db')
    c=conn.cursor()
    #   Users table
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )''')
    # Summaries table
    c.execute('''CREATE TABLE IF NOT EXISTS summaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original_text TEXT NOT NULL,
        summary TEXT NOT NULL,
        user_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )''')


    # conn = get_db_connection()
    # c = conn.cursor()
    
    # # Create users table if it doesn't exist
    # c.execute('''
    #     CREATE TABLE IF NOT EXISTS users (
    #         id INTEGER PRIMARY KEY AUTOINCREMENT,
    #         email TEXT UNIQUE NOT NULL,
    #         password TEXT NOT NULL
    #     )
    # ''')
    # conn.commit()
    # conn.close()





def get_db_connection():
            conn = sqlite3.connect('summarizer.db')
            conn.row_factory = sqlite3.Row  # Returns rows as dictionaries
            return conn


if __name__ == '__main__':
    init_db()  # Run once to create the database
