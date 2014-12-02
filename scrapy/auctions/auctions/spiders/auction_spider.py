from scrapy.spider import BaseSpider
from scrapy.selector import Selector
from auctions.items import AuctionsItem
class AuctionsSpider(BaseSpider):
    name = "auctions" # Name of the spider, to be used when crawling
    allowed_domains = ["buildingdetroit.org"] # Where the spider is allowed to go
    start_urls = [
        'http://auctions.buildingdetroit.org/Home/SoldHouses'
    ]

    def parse(self, response):
        hxs = Selector(response) # The XPath selector
        sites = hxs.select('//div[contains(@class, "block_1")]')
        items = []
        for site in sites:
             item = AuctionsItem()
             item['address'] = site.select('div[contains(@class, "con")]/div[contains(@class, "name")]/a/h4/text()').extract()[0].strip()
             item['price'] = site.select('div[contains(@class, "image")]/div[contains(@class, "price")]/text()').extract()[0].strip()
             item['saleDate'] = site.select('div[contains(@class, "con")]/div[contains(@class, "date")]/span/text()').extract()
             item['squareFeet'] = site.select('div[contains(@class, "last_line")]/div[contains(@class, "blk_1")]/span/text()').extract()
             item['bedrooms'] = site.select('div[contains(@class, "last_line")]/div[contains(@class, "blk_2")]/span/text()').extract()
             item['bathrooms'] = site.select('div[contains(@class, "last_line")]/div[contains(@class, "blk_3")]/span/text()').extract()
             item['url'] = site.select('div[contains(@class, "image")]/a/@href').extract()
             item['image'] = site.select('div[contains(@class, "image")]/a/img/@src').extract()
             items.append(item)
        return items