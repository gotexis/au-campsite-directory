import urllib.request, urllib.parse, json

query = """
[out:json][timeout:60];
area["ISO3166-1"="AU"]->.au;
(
  node["tourism"="camp_site"](area.au);
  way["tourism"="camp_site"](area.au);
  node["tourism"="caravan_site"](area.au);
  way["tourism"="caravan_site"](area.au);
);
out center tags;
"""

url = "https://overpass-api.de/api/interpreter"
data = urllib.parse.urlencode({"data": query}).encode()
req = urllib.request.Request(url, data)
resp = urllib.request.urlopen(req, timeout=60)
result = json.loads(resp.read())

sites = []
for el in result["elements"]:
    tags = el.get("tags", {})
    lat = el.get("lat") or el.get("center", {}).get("lat")
    lon = el.get("lon") or el.get("center", {}).get("lon")
    if not lat or not lon:
        continue
    site = {
        "name": tags.get("name", ""),
        "lat": lat,
        "lon": lon,
        "type": tags.get("tourism", "camp_site"),
        "fee": tags.get("fee", ""),
        "power": tags.get("power_supply", tags.get("electricity", "")),
        "water": tags.get("drinking_water", ""),
        "toilets": tags.get("toilets", ""),
        "showers": tags.get("shower", ""),
        "pets": tags.get("dog", tags.get("pets", "")),
        "phone": tags.get("phone", tags.get("contact:phone", "")),
        "website": tags.get("website", tags.get("contact:website", "")),
        "addr": tags.get("addr:full", tags.get("addr:street", "")),
        "state": tags.get("addr:state", ""),
        "operator": tags.get("operator", ""),
        "capacity": tags.get("capacity", ""),
        "description": tags.get("description", ""),
    }
    sites.append(site)

print(f"Total: {len(sites)}")
named = [s for s in sites if s["name"]]
print(f"Named: {len(named)}")
with_fee = [s for s in sites if s["fee"]]
print(f"With fee info: {len(with_fee)}")
with_power = [s for s in sites if s["power"]]
print(f"With power info: {len(with_power)}")
with_water = [s for s in sites if s["water"]]
print(f"With water info: {len(with_water)}")
with_toilets = [s for s in sites if s["toilets"]]
print(f"With toilets info: {len(with_toilets)}")

with open("/tmp/au-campsites.json", "w") as f:
    json.dump(sites, f, indent=2)

print("Saved to /tmp/au-campsites.json")
