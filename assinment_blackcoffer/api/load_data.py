import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://hackthon_llm:VG49OZJvPqYhpNAI@cluster0.zbdzf1d.mongodb.net/dashboard_db?retryWrites=true&w=majority')
MONGO_DB_NAME = 'dashboard_db'

try:
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB_NAME]
    collection = db['data_entries']
except Exception as e:
    print(f"Failed to connect to MongoDB: {str(e)}")
    exit(1)

def load_data():
    try:
        # Clear existing data
        result = collection.delete_many({})
        print(f"Deleted {result.deleted_count} existing documents.")

        # Load data from jsondata.json with error handling
        with open(r'C:\Users\HP\Downloads\Software-Engineer-Associate-assignment--main\Software-Engineer-Associate-assignment--main\assinment_ blackcoffer\visualization-dashboard\src\data\jsondata.json', 'rb') as file:
            raw_data = file.read()
            text_data = raw_data.decode('utf-8', errors='replace')
            data = json.loads(text_data)
            for entry in data:
                document = {
                    'end_year': entry.get('end_year', ''),
                    'intensity': entry.get('intensity', 0),
                    'sector': entry.get('sector', ''),
                    'topic': entry.get('topic', ''),
                    'insight': entry.get('insight', ''),
                    'url': entry.get('url', ''),
                    'region': entry.get('region', ''),
                    'start_year': entry.get('start_year', ''),
                    'impact': entry.get('impact', ''),
                    'added': entry.get('added', ''),
                    'published': entry.get('published', ''),
                    'country': entry.get('country', ''),
                    'relevance': entry.get('relevance', 0),
                    'pestle': entry.get('pestle', ''),
                    'source': entry.get('source', ''),
                    'title': entry.get('title', ''),
                    'likelihood': entry.get('likelihood', 0),
                }
                collection.insert_one(document)
        print(f"Loaded {collection.count_documents({})} documents into MongoDB.")
    except Exception as e:
        print(f"Error loading data: {str(e)}")
    finally:
        client.close()

# Call the load_data function when the script is run
if __name__ == "__main__":
    load_data()