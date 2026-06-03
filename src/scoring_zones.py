import numpy as np
import pandas as pd
import pickle
import matplotlib.pyplot as plt
from features import calculate_distance, calculate_angle
from visualizations import draw_pitch

def load_model(model_path='models/xg_model.pkl'):
    """Loads the trained XGBoost model and expected feature names."""
    import os
    if not os.path.exists(model_path):
        model_path = '../models/xg_model.pkl'
    with open(model_path, 'rb') as f:
        model_data = pickle.load(f)
    return model_data['model'], model_data['features']

def generate_probability_surface(model, expected_features, x_range=(60, 120), y_range=(0, 80), resolution=1.0):
    """
    Generates a grid of coordinates and predicts the xG for every point.
    Returns X, Y, and Z (probability) matrices suitable for contour plotting.
    """
    # Create grid
    x_coords = np.arange(x_range[0], x_range[1] + resolution, resolution)
    y_coords = np.arange(y_range[0], y_range[1] + resolution, resolution)
    
    xx, yy = np.meshgrid(x_coords, y_coords)
    
    # Flatten for prediction
    flat_x = xx.flatten()
    flat_y = yy.flatten()
    
    # Create dataframe for prediction
    df_grid = pd.DataFrame({'x': flat_x, 'y': flat_y})
    
    # Calculate geometric features
    df_grid['distance_to_goal'] = calculate_distance(df_grid['x'], df_grid['y'])
    df_grid['shooting_angle'] = df_grid.apply(lambda row: calculate_angle(row['x'], row['y']), axis=1)
    
    # Initialize all expected features to 0
    for col in expected_features:
        if col not in df_grid.columns:
            df_grid[col] = 0
            
    # Set standard conditions for the simulation:
    # Assume: Right Foot, Open Play, No Pressure
    if 'shot_body_part_Right Foot' in df_grid.columns:
        df_grid['shot_body_part_Right Foot'] = 1
    if 'play_pattern_Regular Play' in df_grid.columns:
        df_grid['play_pattern_Regular Play'] = 1
        
    # Reorder columns to exactly match model expectations
    X_predict = df_grid[expected_features]
    
    # Predict probability (xG)
    proba = model.predict_proba(X_predict)[:, 1]
    
    # Reshape back to grid
    zz = proba.reshape(xx.shape)
    
    return xx, yy, zz

def plot_danger_map(xx, yy, zz, title="xG Probability Surface (Danger Map)"):
    """
    Plots the probability surface on a football pitch.
    """
    pitch, fig, ax = draw_pitch()
    
    # Plot contour map
    contour = ax.contourf(xx, yy, zz, zorder=3, levels=100, cmap='magma', alpha=0.7)
    
    # Add a colorbar
    cbar = fig.colorbar(contour, ax=ax, fraction=0.046, pad=0.04)
    cbar.ax.set_ylabel('Expected Goals (xG)', color='white', rotation=270, labelpad=20)
    cbar.ax.yaxis.set_tick_params(color='white')
    plt.setp(plt.getp(cbar.ax.axes, 'yticklabels'), color='white')

    ax.set_title(title, color='white', fontsize=18, pad=15)
    return fig, ax

if __name__ == "__main__":
    print("Generating Danger Map...")
    model, features = load_model()
    xx, yy, zz = generate_probability_surface(model, features)
    fig, ax = plot_danger_map(xx, yy, zz)
    # Save the figure
    import os
    img_dir = 'images'
    if not os.path.exists('models'):
        img_dir = '../images'
    os.makedirs(img_dir, exist_ok=True)
    fig.savefig(f'{img_dir}/danger_map.png', bbox_inches='tight', facecolor=fig.get_facecolor())
    print(f"Danger map saved to {img_dir}/danger_map.png")
