import nbformat as nbf
import os

nb = nbf.v4.new_notebook()

nb['cells'] = [
    nbf.v4.new_markdown_cell("""# Phase 3: Football Visualizations
In this notebook, we will use our new `visualizations` module to draw authentic football pitches and map the shots we extracted in Phase 2.
"""),
    
    nbf.v4.new_code_cell("""import pandas as pd
import sys
import os
import matplotlib.pyplot as plt

# Add the src folder to the python path so we can import our module
sys.path.append(os.path.abspath('../src'))
import visualizations as viz

# Set inline plotting for Jupyter
%matplotlib inline"""),
    
    nbf.v4.new_markdown_cell("""## Load the Dataset
Let's load the `processed_shots.csv` containing the ~7000 World Cup shots we extracted."""),
    
    nbf.v4.new_code_cell("""df = pd.read_csv('../data/processed_shots.csv')
print(f"Loaded {len(df)} shots.")
df.head(3)"""),
    
    nbf.v4.new_markdown_cell("""## 1. Player Shot Map: Lionel Messi
Let's filter the dataset for Lionel Messi and plot his shot map using the functions we built.
Goals are green stars, and misses are red dots. The size of the marker represents the Expected Goals (xG) value!"""),
    
    nbf.v4.new_code_cell("""# Filter for Messi
messi_shots = df[df['player'] == 'Lionel Andrés Messi Cuccittini']
print(f"Found {len(messi_shots)} World Cup shots for Messi.")

# Plot
pitch, fig, ax = viz.draw_pitch()
viz.plot_shot_map(messi_shots, title="Lionel Messi - World Cup Shot Map", ax=ax, pitch=pitch)
plt.show()"""),
    
    nbf.v4.new_markdown_cell("""## 2. Team Shot Map: Argentina 2022
Let's see where Argentina took their shots during their victorious 2022 campaign."""),
    
    nbf.v4.new_code_cell("""argentina_22 = df[(df['team'] == 'Argentina') & (df['season'] == '2022')]

pitch, fig, ax = viz.draw_pitch()
viz.plot_shot_map(argentina_22, title="Argentina 2022 - World Cup Shot Map", ax=ax, pitch=pitch)
plt.show()"""),
    
    nbf.v4.new_markdown_cell("""## 3. World Cup Goal Density Heatmap
Where do most goals happen? Let's take ALL the goals from our massive dataset and plot a KDE heatmap to find the most dangerous zones on the pitch."""),
    
    nbf.v4.new_code_cell("""all_goals = df[df['is_goal'] == 1]

pitch, fig, ax = viz.draw_pitch()
viz.plot_density_heatmap(all_goals, title="Where Do World Cup Goals Come From?", ax=ax, pitch=pitch)
plt.show()""")
]

# Ensure notebooks directory exists
os.makedirs('D:/WC project/notebooks', exist_ok=True)

with open('D:/WC project/notebooks/02_visualizations.ipynb', 'w', encoding='utf-8') as f:
    nbf.write(nb, f)
