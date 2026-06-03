import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from mplsoccer import Pitch

def draw_pitch(pitch_type='statsbomb', pitch_color='#22312b', line_color='#c7d5cc'):
    """
    Draws a beautiful, premium football pitch.
    Returns the matplotlib figure and axis.
    """
    pitch = Pitch(pitch_type=pitch_type, pitch_color=pitch_color, line_color=line_color)
    fig, ax = pitch.draw(figsize=(10, 7))
    # Keep the background of the figure matching the pitch
    fig.patch.set_facecolor(pitch_color)
    return pitch, fig, ax

def plot_shot_map(df, title="Shot Map", ax=None, pitch=None):
    """
    Plots a shot map given a dataframe of shots.
    Requires 'x', 'y', 'is_goal', and 'statsbomb_xg' columns.
    """
    if ax is None or pitch is None:
        pitch, fig, ax = draw_pitch()
        
    # Split into goals and non-goals
    goals = df[df['is_goal'] == 1]
    non_goals = df[df['is_goal'] == 0]
    
    # We will use xG to determine the size of the scatter points
    # Fill NA xG with a small base value so it still plots
    goals_xg = goals['statsbomb_xg'].fillna(0.05) * 500
    non_goals_xg = non_goals['statsbomb_xg'].fillna(0.05) * 500
    
    # Plot non-goals (misses, saves, blocks)
    pitch.scatter(non_goals['x'], non_goals['y'], 
                  s=non_goals_xg, edgecolors='white', c='#ea6969', 
                  alpha=0.6, label='Miss/Saved', ax=ax)
                  
    # Plot goals
    pitch.scatter(goals['x'], goals['y'], 
                  s=goals_xg, edgecolors='white', c='#28a745', 
                  alpha=0.9, marker='*', label='Goal', ax=ax)
                  
    ax.set_title(title, color='white', fontsize=18, pad=15)
    
    # Create legend
    legend = ax.legend(loc='upper right', facecolor='#22312b', edgecolor='white', labelcolor='white')
    
    return ax

def plot_density_heatmap(df, title="Shot Density Heatmap", ax=None, pitch=None):
    """
    Plots a KDE (Kernel Density Estimate) heatmap to show dangerous zones.
    """
    if ax is None or pitch is None:
        pitch, fig, ax = draw_pitch()
        
    # Draw KDE plot using mplsoccer's integrated seaborn KDE
    pitch.kdeplot(
        df['x'], df['y'], ax=ax,
        cmap='magma', shade=True, n_levels=100, alpha=0.8, fill=True
    )
    
    ax.set_title(title, color='white', fontsize=18, pad=15)
    return ax

if __name__ == "__main__":
    # Quick test to make sure it runs without error
    import os
    if os.path.exists('../data/processed_shots.csv'):
        print("Testing visualization module...")
        df = pd.read_csv('../data/processed_shots.csv')
        # Test just the first 100 shots
        pitch, fig, ax = draw_pitch()
        plot_shot_map(df.head(100), title="Test Map", ax=ax, pitch=pitch)
        print("Success! Close figure to exit.")
        plt.show()
