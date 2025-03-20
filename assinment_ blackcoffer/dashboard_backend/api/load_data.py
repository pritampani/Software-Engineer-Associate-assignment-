import json
from api.models import DataEntry

def load_data():
    with open('/Users/pritampani/Desktop/assinment_ blackcoffer/visualization-dashboard/src/data/jsondata.json', 'r') as file:  # Update the path
        data = json.load(file)
        for entry in data:
            DataEntry.objects.create(
                end_year=entry.get('end_year', ''),
                intensity=entry.get('intensity', 0),
                sector=entry.get('sector', ''),
                topic=entry.get('topic', ''),
                insight=entry.get('insight', ''),
                url=entry.get('url', ''),
                region=entry.get('region', ''),
                start_year=entry.get('start_year', ''),
                impact=entry.get('impact', ''),
                added=entry.get('added', ''),
                published=entry.get('published', ''),
                country=entry.get('country', ''),
                relevance=entry.get('relevance', 0),
                pestle=entry.get('pestle', ''),
                source=entry.get('source', ''),
                title=entry.get('title', ''),
                likelihood=entry.get('likelihood', 0),
            )

if __name__ == "__main__":
    load_data()