import pandas as pd
import numpy as np

def calculate_distance(x, y, goal_x=120, goal_y=40):
    """
    Calculates Euclidean distance from shot location to the center of the goal.
    StatsBomb pitch is 120x80.
    """
    return np.sqrt((goal_x - x)**2 + (goal_y - y)**2)

def calculate_angle(x, y):
    """
    Calculates the visible shooting angle to the goal mouth.
    Goal posts are at X=120, Y=36 and Y=44.
    """
    # Goalposts
    goal_post_1 = np.array([120, 36])
    goal_post_2 = np.array([120, 44])
    
    # Shot location
    shot = np.array([x, y])
    
    # Vectors to the posts
    v1 = goal_post_1 - shot
    v2 = goal_post_2 - shot
    
    # Handle shots exactly on the goal line to avoid division by zero
    if x == 120:
        return 0.0
        
    # Calculate angle in radians
    # Cosine rule: dot product
    dot_product = np.sum(v1 * v2, axis=-1)
    norm_v1 = np.linalg.norm(v1, axis=-1)
    norm_v2 = np.linalg.norm(v2, axis=-1)
    
    # Prevent division by zero
    with np.errstate(divide='ignore', invalid='ignore'):
        cos_theta = dot_product / (norm_v1 * norm_v2)
        # Clip for numerical stability
        cos_theta = np.clip(cos_theta, -1.0, 1.0)
        angle_rad = np.arccos(cos_theta)
        
    return np.degrees(angle_rad)

def engineer_features(df):
    """
    Takes the raw shots dataframe and creates mathematical and categorical features.
    """
    df_engineered = df.copy()
    
    print("Calculating Distance to Goal...")
    df_engineered['distance_to_goal'] = calculate_distance(df_engineered['x'], df_engineered['y'])
    
    print("Calculating Shooting Angle...")
    # Apply to each row (vectorized approach is possible but apply is safe here)
    df_engineered['shooting_angle'] = df_engineered.apply(lambda row: calculate_angle(row['x'], row['y']), axis=1)
    
    # Let's keep only the columns that might be useful for ML
    cols_to_keep = [
        'match_id', 'competition', 'season', 'team', 'player', 'minute',
        'x', 'y', 'distance_to_goal', 'shooting_angle',
        'shot_type', 'shot_body_part', 'shot_technique', 'play_pattern',
        'under_pressure', 'is_goal', 'statsbomb_xg'
    ]
    
    return df_engineered[cols_to_keep]

if __name__ == "__main__":
    print("=== Feature Engineering ===")
    
    input_file = '../data/processed_shots.csv'
    output_file = '../data/modeling_shots.csv'
    
    try:
        # We assume the script is run from inside the src directory or project root
        import os
        if not os.path.exists('data/processed_shots.csv'):
            # try relative to src
            input_file = '../data/processed_shots.csv'
            output_file = '../data/modeling_shots.csv'
        else:
            input_file = 'data/processed_shots.csv'
            output_file = 'data/modeling_shots.csv'
            
        print(f"Loading data from {input_file}...")
        df = pd.read_csv(input_file)
        
        print(f"Original shape: {df.shape}")
        
        df_modeling = engineer_features(df)
        
        print(f"Engineered shape: {df_modeling.shape}")
        print("Feature preview:")
        print(df_modeling[['distance_to_goal', 'shooting_angle']].head())
        
        df_modeling.to_csv(output_file, index=False)
        print(f"Saved modeling dataset to {output_file}")
        
    except FileNotFoundError:
        print("Error: Could not find processed_shots.csv. Please ensure Phase 2 has been completed.")
