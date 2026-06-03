# World Cup Shot Intelligence Platform

An interactive football analytics platform built to help football fans understand where players and teams are most likely to score using historical shot data, expected goals (xG), machine learning, and interactive visualizations.

## Overview
This platform explores StatsBomb open data to create a modern web experience predicting scoring probabilities.

### Tech Stack
- **Data Processing**: Pandas, NumPy
- **Machine Learning**: XGBoost, Scikit-Learn
- **Data Source**: StatsBomb Open Data
- **Visualizations**: Matplotlib, Plotly, Seaborn
- **Backend / Frontend**: FastAPI, Streamlit

## Setup Instructions

1. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd "WC project"
   ```

2. **Create a Virtual Environment**
   ```bash
   python -m venv venv
   ```

3. **Activate Environment**
   - Windows: `.\venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## Project Structure
- `data/`: Raw and processed data.
- `notebooks/`: Jupyter notebooks for data exploration.
- `src/`: Source code modules (data loading, modeling, visualizations).

---
*Built as a production-grade passion project.*
