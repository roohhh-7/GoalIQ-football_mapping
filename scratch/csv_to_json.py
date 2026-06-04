import pandas as pd
import json

# Load the modeled data
df = pd.read_csv('data/modeling_shots.csv')

# We don't need all columns to keep the payload size small. 
# Keep essential columns for the dashboard:
cols_to_keep = ['player', 'team', 'season', 'x', 'y', 'is_goal', 'statsbomb_xg', 'shot_body_part', 'play_pattern']
df = df[cols_to_keep]

# Drop rows with missing location or xG just in case
df = df.dropna(subset=['x', 'y', 'statsbomb_xg'])

# Convert to JSON records
json_data = df.to_dict(orient='records')

# Save to data/shots.json
with open('data/shots.json', 'w') as f:
    json.dump(json_data, f)

print(f"Successfully converted {len(json_data)} shots to JSON.")
