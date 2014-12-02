from scrapy.item import Item, Field

class AuctionsItem(Item):
    address = Field()
    price = Field()
    saleDate = Field()
    squareFeet = Field()
    bedrooms = Field()
    bathrooms = Field()
    url = Field()
    image = Field()