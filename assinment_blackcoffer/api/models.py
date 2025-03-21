from django.db import models

class DataEntry(models.Model):
    end_year = models.CharField(max_length=10, blank=True)
    intensity = models.IntegerField()
    sector = models.CharField(max_length=100, blank=True)
    topic = models.CharField(max_length=100, blank=True)
    insight = models.TextField(blank=True)
    url = models.URLField(blank=True)
    region = models.CharField(max_length=100, blank=True)
    start_year = models.CharField(max_length=10, blank=True)
    impact = models.CharField(max_length=100, blank=True)
    added = models.CharField(max_length=50, blank=True)
    published = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=100, blank=True)
    relevance = models.IntegerField()
    pestle = models.CharField(max_length=100, blank=True)
    source = models.CharField(max_length=100, blank=True)
    title = models.TextField(blank=True)
    likelihood = models.IntegerField()

    def __str__(self):
        return self.title