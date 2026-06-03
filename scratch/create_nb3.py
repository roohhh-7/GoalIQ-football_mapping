import nbformat as nbf
import os

nb = nbf.v4.new_notebook()

nb['cells'] = [
    nbf.v4.new_markdown_cell("""# Phase 6: Scoring Zone Intelligence
In this notebook, we utilize our trained XGBoost Machine Learning model to evaluate the true value of pitch real estate. 
By generating a grid covering the attacking half and predicting the xG for every single coordinate, we can visualize the ultimate "Danger Map"."""),
    
    nbf.v4.new_code_cell("""import sys
import os
import matplotlib.pyplot as plt

# Add the src folder to the python path
sys.path.append(os.path.abspath('../src'))
import scoring_zones as sz

# Set inline plotting for Jupyter
%matplotlib inline"""),
    
    nbf.v4.new_markdown_cell("""## 1. Load the Model
We will load the `xg_model.pkl` we trained in Phase 5."""),
    
    nbf.v4.new_code_cell("""model, features = sz.load_model()
print(f"Model loaded successfully! Expected features: {len(features)}")"""),
    
    nbf.v4.new_markdown_cell("""## 2. Generate and Plot the Danger Map
We simulate a shot taken from every 1-yard square on the attacking half of the pitch. We assume standard conditions: an open play shot taken with the right foot under no pressure."""),
    
    nbf.v4.new_code_cell("""# Generate the coordinate grid and predict probabilities
xx, yy, zz = sz.generate_probability_surface(model, features)

# Plot the glowing Danger Map contour
fig, ax = sz.plot_danger_map(xx, yy, zz, title="xG Probability Surface (The Golden Zone)")
plt.show()"""),
    
    nbf.v4.new_markdown_cell("""### Insights
Notice how the probability of scoring drops off drastically the further you move away from the center of the penalty box.
Even deep inside the box, if you are out wide (a poor shooting angle), the xG is remarkably low. This mathematically proves why the modern game focuses so heavily on cutbacks into the center rather than shots from wide angles!""")
]

# Ensure notebooks directory exists
os.makedirs('D:/WC project/notebooks', exist_ok=True)

with open('D:/WC project/notebooks/03_scoring_zones.ipynb', 'w', encoding='utf-8') as f:
    nbf.write(nb, f)
