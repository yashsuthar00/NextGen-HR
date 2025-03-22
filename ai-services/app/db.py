from pymongo import MongoClient

class Database:
    def __init__(self, uri="mongodb://localhost:27017/", db_name="hr_database"):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]

    def insert_one(self, collection_name, data):
        collection = self.db[collection_name]
        return collection.insert_one(data).inserted_id

    def find_one(self, collection_name, query):
        collection = self.db[collection_name]
        return collection.find_one(query)

    def find_many(self, collection_name, query):
        collection = self.db[collection_name]
        return list(collection.find(query))

    def update_one(self, collection_name, query, update):
        collection = self.db[collection_name]
        return collection.update_one(query, {'$set': update})

    def delete_one(self, collection_name, query):
        collection = self.db[collection_name]
        return collection.delete_one(query)
