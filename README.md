Auctioning Detroit
==================

<p>The City of Detroit, through the <strong>Detroit Land Bank
Authority (DLBA)</strong>, has been auctioning homes since May 2014
with the hopes of attracting new residents to the city's
neighborhoods. The auctions come with strict rules. Detroit isn't
in the market for investors looking for a quick buck and wants to
prevent the homes from having the same fate as many of those
auctioned through Wayne County's tax-foreclosure auctions, an
auction system for which <a href=
"http://michiganradio.org/post/wayne-county-sues-collect-back-taxes-properties-it-once-sold-tax-foreclosure-auctions"
target="_blank">78 percent</a> of homes have fallen back into tax
deliquency. Winning bidders in the DLBA auctions must agree to
rehab the homes and establish occupancy, and Detroit follows up on
the promise. Within 30 days of an auction closing, the buyer must
produce a signed contract for rehabilitation/renovation or
demonstrate the skill to carry out the rehab by his/herself. Within
six months, the house must be rehabbed and occupied. Failure to
meet these milestones results in the forfeiture of the property
back to the Land Bank.</p>

<p>Detroit has now auctioned a few hundred of these properties, and
every day auctions a couple more. This website maps the results of
those auctions and adds visualization tools to help the user better
contextualize closing prices throughout the city. Data is updated
through the end of November. I completed this project as part of a
<a href=
"https://www.pratt.edu/academics/continuing-education-and-professional/pro-certificate-programs/certificate-program-in-gis-and-design/%20target=">
GIS and Design Certificate Program</a> at Pratt Institute.</p>

<h3>About the Data</h3><img alt="Auction listings" src=
"images/detroit_auctions.png">

<p>DBLA's <a href=
"http://auctions.buildingdetroit.org/Home/SoldHouses" target=
"_blank">Past Auctions</a> website serves as the basis for
"Auctioning Detroit." I scraped the website using the <a href=
"http://scrapy.org/" target="_blank">Scrapy</a> framework for
Python. <a href=
"https://github.com/mpetric/auctioning-detroit/blob/master/scrapy/auctions/auctions/spiders/auction_spider.py"
target="_blank">Code</a> for my spider, as well as all other code
and data for this site, can be <a href=
"https://github.com/mpetric/auctioning-detroit" target=
"_blank">found on GitHub.</a> In addition, I supplemented the data
from DBLA with lot and neighborhood information from a Detroit
parcel's shapefile that can be downloaded <a href=
"https://github.com/mpetric/auctioning-detroit/tree/master/data/detroit_polygons"
target="_blank">here.</a> Finally, the neighborhood hover outlines
came from a shapefile of Detroit's master plan neighborhoods from
the City's <a href=
"http://www.detroitmi.gov/DepartmentsandAgencies/PlanningDevelopmentDepartment/Planning/InformationServiceandMapping/CommunityInformationandMapping/AdvancedMaps/DownloadGISFiles.aspx"
target="_blank">GIS Portal.</a></p>

<h3>About the Site Design</h3>

<p>The website is built using the <a href=
"http://getbootstrap.com/">Bootstrap</a> front-end framework, which
allows for relatively painless mobile-first responsive design.</p>

<p>The map features are achieved using the <a href=
"http://leafletjs.com/" target="_blank">Leaflet</a> JavaScript
library, originally developed by Vladimir Agafonkin. Much of the
site interactivity is accomplished via <a href="http://jquery.com/"
target="_blank">jQuery</a>. The address search feature is built
using the <a href="https://github.com/smeijer/L.GeoSearch" target=
"_blank">GeoSearch</a> plugin by Stephan Meijer. The web site uses
<a href="http://josscrowcroft.github.io/accounting.js/" target=
"_blank">account.js</a> to easily format numbers as currency and
other bits of code I picked up here and there on websites like
Stack Overflow.</p>
