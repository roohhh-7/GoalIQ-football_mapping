import os
import pandas as pd
from statsbombpy import sb
import warnings

# Suppress warnings from statsbombpy about unauthenticated access
warnings.filterwarnings('ignore')

def fetch_all_world_cup_shots():
    """
    Fetches all shot events from all available Men's and Women's World Cups in the StatsBomb Open Data.
    Returns a cleaned, flattened pandas DataFrame.
    """
    print("Fetching available competitions...")
    comps = sb.competitions()
    
    # Filter for both Men's and Women's World Cups
    wc_comps = comps[comps['competition_name'].isin(['FIFA World Cup', "Women's World Cup"])]
    
    all_shots = []
    
    for _, comp in wc_comps.iterrows():
        comp_id = comp['competition_id']
        season_id = comp['season_id']
        comp_name = comp['competition_name']
        season_name = comp['season_name']
        
        print(f"\nProcessing: {comp_name} ({season_name})")
        
        try:
            matches = sb.matches(competition_id=comp_id, season_id=season_id)
        except Exception as e:
            print(f"  Error fetching matches: {e}")
            continue
            
        print(f"  Found {len(matches)} matches. Fetching events...")
        
        for _, match in matches.iterrows():
            match_id = match['match_id']
            try:
                # Fetch events for the match
                events = sb.events(match_id=match_id)
                
                # We only want shots
                if 'type' not in events.columns or 'Shot' not in events['type'].values:
                    continue
                    
                match_shots = events[events['type'] == 'Shot'].copy()
                
                # For each shot, extract the features we need
                for _, shot in match_shots.iterrows():
                    
                    # Extract X, Y coordinates
                    location = shot.get('location')
                    x = location[0] if isinstance(location, list) and len(location) >= 2 else None
                    y = location[1] if isinstance(location, list) and len(location) >= 2 else None
                    
                    # Target variable: Is it a goal?
                    outcome = shot.get('shot_outcome')
                    is_goal = 1 if outcome == 'Goal' else 0
                    
                    # Build flat dictionary
                    shot_data = {
                        'match_id': match_id,
                        'competition': comp_name,
                        'season': season_name,
                        'team': shot.get('team'),
                        'player': shot.get('player'),
                        'minute': shot.get('minute'),
                        'second': shot.get('second'),
                        'x': x,
                        'y': y,
                        'shot_type': shot.get('shot_type'),
                        'shot_body_part': shot.get('shot_body_part'),
                        'shot_technique': shot.get('shot_technique'),
                        'play_pattern': shot.get('play_pattern'),
                        'under_pressure': int(shot.get('under_pressure', False) == True),
                        'statsbomb_xg': shot.get('shot_statsbomb_xg'),
                        'outcome': outcome,
                        'is_goal': is_goal
                    }
                    all_shots.append(shot_data)
                    
            except Exception as e:
                # Some matches might fail to download or have missing data
                print(f"  Failed on match {match_id}: {e}")
                
    print(f"\nTotal shots extracted across all World Cups: {len(all_shots)}")
    
    # Convert to DataFrame
    df = pd.DataFrame(all_shots)
    
    # Drop rows with missing crucial data (like missing location)
    initial_len = len(df)
    df = df.dropna(subset=['x', 'y', 'is_goal'])
    print(f"Dropped {initial_len - len(df)} shots due to missing coordinates.")
    
    return df

if __name__ == "__main__":
    print("=== World Cup Shot Dataset Extraction ===")
    
    # Ensure data directory exists
    os.makedirs('data', exist_ok=True)
    
    # Fetch and process the data
    shots_df = fetch_all_world_cup_shots()
    
    # Save to CSV
    output_path = 'data/processed_shots.csv'
    shots_df.to_csv(output_path, index=False)
    
    print(f"Successfully saved clean dataset to {output_path}")
    print("Dataset Preview:")
    print(shots_df.head(3))
