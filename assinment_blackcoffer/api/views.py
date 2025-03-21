from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
import os
from django.core.paginator import Paginator
from bson.objectid import ObjectId  # Import ObjectId to handle conversion

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://hackthon_llm:VG49OZJvPqYhpNAI@cluster0.zbdzf1d.mongodb.net/dashboard_db?retryWrites=true&w=majority')
MONGO_DB_NAME = 'dashboard_db'

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]
collection = db['data_entries']

class DataEntryList(APIView):
    def get(self, request):
        # Build query based on filters
        query = {}
        end_year = request.query_params.get('end_year', None)
        topic = request.query_params.get('topic', None)
        sector = request.query_params.get('sector', None)
        pestle = request.query_params.get('pestle', None)
        source = request.query_params.get('source', None)
        country = request.query_params.get('country', None)
        region = request.query_params.get('region', None)

        if end_year and end_year != "All":
            query['end_year'] = end_year
        if topic and topic != "All":
            query['topic'] = topic
        if sector and sector != "All":
            query['sector'] = sector
        if pestle and pestle != "All":
            query['pestle'] = pestle
        if source and source != "All":
            query['source'] = source
        if country and country != "All":
            query['country'] = country
        if region and region != "All":
            query['region'] = region

        # Fetch data from MongoDB
        data = list(collection.find(query))

        # Convert ObjectId to string for each document
        for item in data:
            if '_id' in item:
                item['_id'] = str(item['_id'])  # Convert ObjectId to string

        # Add pagination
        page = int(request.query_params.get('page', 1))
        per_page = 100  # Items per page
        paginator = Paginator(data, per_page)

        try:
            page_data = paginator.page(page)
        except Exception as e:
            return Response({"error": "Invalid page number"}, status=status.HTTP_400_BAD_REQUEST)

        # Prepare response
        response_data = {
            'count': paginator.count,
            'next': f"?page={page + 1}" if page < paginator.num_pages else None,
            'previous': f"?page={page - 1}" if page > 1 else None,
            'results': list(page_data.object_list)
        }

        return Response(response_data, status=status.HTTP_200_OK)


class IndexView(TemplateView):
    template_name = 'index.html'

class DashboardDataView(APIView):
    def get(self, request):
        try:
            return Response({'message': 'API is working'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Ensure the MongoDB client is closed when the application shuts down
import atexit
atexit.register(client.close)