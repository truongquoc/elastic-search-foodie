import pandas as pd
import random
from faker import Faker
from tqdm import tqdm

# Initialize Faker
fake = Faker()

# Define Cuisine Types
cuisine_types = [
    "Italian", "Chinese", "Mexican", "Indian", "American", "French", "Japanese", 
    "Mediterranean", "Thai", "Korean", "Vietnamese", "Brazilian", "Greek", "Turkish"
]

# Function to Generate a Single Restaurant Record
def generate_restaurant():
    # Generate price range based on restaurant tier
    tier = random.randint(1, 4)
    if tier == 1:
        min_price = random.randint(10, 20)
        max_price = random.randint(25, 35)
    elif tier == 2:
        min_price = random.randint(30, 40)
        max_price = random.randint(45, 65)
    elif tier == 3:
        min_price = random.randint(60, 70)
        max_price = random.randint(75, 100)
    else:
        min_price = random.randint(95, 120)
        max_price = random.randint(125, 200)

    return {
        "Name": fake.company() + " Restaurant",
        "Address": fake.address().replace("\n", ", "),
        "City": fake.city(),
        "State": fake.state(),
        "Zip Code": fake.zipcode(),
        "Phone": fake.phone_number(),
        "Cuisine Type": random.choice(cuisine_types),
        "Rating": round(random.uniform(2.5, 5.0), 1),
        "Review Count": random.randint(10, 5000),
        "minPrice": min_price,
        "maxPrice": max_price,
        "Opening Hours": f"{random.randint(6, 11)} AM - {random.randint(8, 11)} PM",
        "Latitude": fake.latitude(),
        "Longitude": fake.longitude(),
    }

# Generate 400,000 Records
num_records = 400000
data = [generate_restaurant() for _ in tqdm(range(num_records), desc="Generating Data")]

# Convert to DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv("restaurants_400k.csv", index=False)

print("✅ 400K Restaurant Records Generated & Saved to CSV!")
