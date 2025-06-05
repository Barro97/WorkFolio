from flask import g
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import pymongo

# Global variable to hold the client. Avoid initializing connection here.
client = None

def init_db(app):
    """Initialize the database connection using app config."""
    global client
    uri = app.config.get('MONGO_URI')
    if not uri:
        raise ValueError("MONGO_URI not set in Flask config")
    
    if client is None:
        client = MongoClient(uri, server_api=ServerApi('1'))
        try:
            client.admin.command('ping')
            print("Successfully connected to MongoDB!")
            print(f"PyMongo version: {pymongo.version}")
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            # Depending on the app needs, you might want to raise the exception
            # or handle it differently (e.g., set client to None)
            client = None # Ensure client is None if connection failed
            raise e # Re-raise the exception to halt app startup if DB is critical

def get_db():
    """Return the database instance, specific to the current request/context."""
    if 'db' not in g:
        if client is None:
             # This typically should not happen if init_db is called correctly at startup
             # and raises an error on failure. 
             # Consider adding a check or alternative logic if lazy connection is desired.
            raise RuntimeError("Database not initialized. Call init_db() first.")
        # Assuming your database name is part of the URI or you have a standard name
        # If the database name isn't implicitly in the URI, you might need to parse it 
        # or add another config variable for DB_NAME.
        # For Atlas URIs like the one provided, the default db is often specified.
        # Let's assume the client connects to the default database specified in the URI
        g.db = client.get_default_database()
        if g.db is None:
            # If get_default_database() returns None (e.g., db name not in URI)
            # You might need to specify it explicitly, e.g., client['user_database']
            # Or fetch the name from config: client[current_app.config['MONGO_DB_NAME']]
             raise RuntimeError("Could not determine default database from URI. Specify DB name?")
    return g.db

def get_users_collection():
    db = get_db()
    return db['users']

def get_messages_collection():
    db = get_db()
    return db['messages']

# Optional: Add a function to close the connection when the app tears down
def close_db(e=None):
    # No need to explicitly close client with modern PyMongo drivers typically,
    # but can be useful for cleanup or specific resource management.
    # client is global, so we don't pop it from 'g'.
    # If you were storing the client in 'g', you'd do: client = g.pop('mongo_client', None)
    # If client needs explicit closing: 
    # global client
    # if client:
    #     client.close()
    #     print("MongoDB connection closed.")
    pass # Usually not needed

# Example of how to integrate with Flask app teardown (in app.py or factory):
# app.teardown_appcontext(close_db)


