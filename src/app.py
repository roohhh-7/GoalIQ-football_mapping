import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import os
import sys
import seaborn as sns

# Add src to path to import visualizations
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from visualizations import draw_pitch, plot_shot_map, plot_density_heatmap

# Must be the first Streamlit command
st.set_page_config(
    page_title="World Cup Shot Intelligence",
    page_icon="⚽",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Premium Dark Mode Look
st.markdown("""
<style>
    .metric-card {
        background-color: #1E293B;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border: 1px solid #334155;
    }
    .metric-value {
        font-size: 36px;
        font-weight: 700;
        color: #38BDF8;
        margin-bottom: 5px;
    }
    .metric-label {
        font-size: 14px;
        color: #94A3B8;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .highlight-positive { color: #22C55E; }
    .highlight-negative { color: #EF4444; }
</style>
""", unsafe_allow_html=True)

@st.cache_data
def load_data():
    """Load the preprocessed modeling shots data."""
    # Assuming app is run from project root
    file_path = 'data/modeling_shots.csv'
    if not os.path.exists(file_path):
        file_path = '../data/modeling_shots.csv'
    return pd.read_csv(file_path)

def render_metric_card(label, value, delta=None):
    """Helper to render beautiful custom metrics."""
    delta_html = ""
    if delta is not None:
        color_class = "highlight-positive" if delta > 0 else "highlight-negative"
        sign = "+" if delta > 0 else ""
        delta_html = f"<div style='font-size: 14px;' class='{color_class}'>{sign}{delta:.2f} vs xG</div>"
        
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-value">{value}</div>
        <div class="metric-label">{label}</div>
        {delta_html}
    </div>
    """, unsafe_allow_html=True)

def main():
    # Load Data
    df = load_data()
    
    # Sidebar Navigation & Filters
    st.sidebar.image("https://cdn-icons-png.flaticon.com/512/1165/1165194.png", width=100) # Generic football icon
    st.sidebar.title("Shot Intelligence")
    st.sidebar.markdown("---")
    
    view_mode = st.sidebar.radio("Navigation", ["Player Intelligence", "Team Intelligence", "World Cup Heatmap"])
    
    if view_mode == "Player Intelligence":
        st.title("🏃‍♂️ Player Intelligence")
        st.markdown("Search for any player to instantly analyze their finishing ability and preferred shooting zones.")
        
        # Get list of players who have at least 5 shots for better analysis
        shot_counts = df['player'].value_counts()
        valid_players = shot_counts[shot_counts >= 3].index.sort_values()
        
        # Default to Messi if he exists, otherwise the first player
        default_idx = 0
        if 'Lionel Andrés Messi Cuccittini' in valid_players:
            default_idx = list(valid_players).index('Lionel Andrés Messi Cuccittini')
            
        selected_player = st.selectbox("Search Player", valid_players, index=default_idx)
        
        # Filter data for selected player
        player_df = df[df['player'] == selected_player]
        
        # Calculate Metrics
        total_shots = len(player_df)
        total_goals = player_df['is_goal'].sum()
        total_xg = player_df['statsbomb_xg'].sum()
        finishing_eff = total_goals - total_xg
        
        # Display Metrics
        col1, col2, col3 = st.columns(3)
        with col1:
            render_metric_card("Total Shots", total_shots)
        with col2:
            render_metric_card("Expected Goals (xG)", f"{total_xg:.2f}")
        with col3:
            render_metric_card("Actual Goals", total_goals, delta=finishing_eff)
            
        st.markdown("---")
        
        # Main Visualizations
        viz_col, context_col = st.columns([2, 1])
        
        with viz_col:
            st.subheader(f"Shot Map: {selected_player}")
            pitch, fig, ax = draw_pitch()
            plot_shot_map(player_df, title="", ax=ax, pitch=pitch)
            st.pyplot(fig)
            
        with context_col:
            st.subheader("Shot Preferences")
            
            # Body Part Chart
            st.markdown("**Strong Foot Tendency**")
            body_part_counts = player_df['shot_body_part'].value_counts()
            fig2, ax2 = plt.subplots(figsize=(4, 3))
            fig2.patch.set_facecolor('#0E1117')
            ax2.set_facecolor('#0E1117')
            sns.barplot(x=body_part_counts.values, y=body_part_counts.index, ax=ax2, palette="Blues_r")
            ax2.tick_params(colors='white')
            ax2.spines['bottom'].set_color('white')
            ax2.spines['left'].set_color('white')
            st.pyplot(fig2)
            
            # Play Pattern Chart
            st.markdown("**Context (Play Pattern)**")
            pattern_counts = player_df['play_pattern'].value_counts().head(5)
            fig3, ax3 = plt.subplots(figsize=(4, 3))
            fig3.patch.set_facecolor('#0E1117')
            ax3.set_facecolor('#0E1117')
            sns.barplot(x=pattern_counts.values, y=pattern_counts.index, ax=ax3, palette="Purples_r")
            ax3.tick_params(colors='white')
            ax3.spines['bottom'].set_color('white')
            ax3.spines['left'].set_color('white')
            st.pyplot(fig3)
            
    elif view_mode == "Team Intelligence":
        st.title("🛡️ Team Intelligence")
        st.markdown("Analyze how different nations generate their expected goals and who their most dangerous shooters are.")
        
        # Get list of teams
        teams = df['team'].sort_values().unique()
        
        # Default to Argentina if they exist
        default_team_idx = list(teams).index('Argentina') if 'Argentina' in teams else 0
        selected_team = st.selectbox("Search Nation", teams, index=default_team_idx)
        
        # Filter data for selected team
        team_df = df[df['team'] == selected_team]
        
        # Allow filtering by season (World Cup Year) for that team
        seasons = team_df['season'].sort_values(ascending=False).unique()
        selected_season = st.selectbox("Select World Cup", seasons)
        
        # Final filtered dataframe
        team_season_df = team_df[team_df['season'] == selected_season]
        
        # Calculate Metrics
        total_shots = len(team_season_df)
        total_goals = team_season_df['is_goal'].sum()
        total_xg = team_season_df['statsbomb_xg'].sum()
        finishing_eff = total_goals - total_xg
        
        # Display Metrics
        col1, col2, col3 = st.columns(3)
        with col1:
            render_metric_card("Total Team Shots", total_shots)
        with col2:
            render_metric_card("Expected Goals (xG)", f"{total_xg:.2f}")
        with col3:
            render_metric_card("Actual Goals", total_goals, delta=finishing_eff)
            
        st.markdown("---")
        
        viz_col, context_col = st.columns([2, 1])
        
        with viz_col:
            st.subheader(f"Shot Map: {selected_team} ({selected_season})")
            if total_shots > 0:
                pitch, fig, ax = draw_pitch()
                plot_shot_map(team_season_df, title="", ax=ax, pitch=pitch)
                st.pyplot(fig)
            else:
                st.warning("No shots found for this selection.")
                
        with context_col:
            st.subheader("Top Shooters Leaderboard")
            if total_shots > 0:
                # Group by player
                shooter_stats = team_season_df.groupby('player').agg(
                    Shots=('is_goal', 'count'),
                    Goals=('is_goal', 'sum'),
                    xG=('statsbomb_xg', 'sum')
                ).reset_index()
                
                # Sort by shots
                shooter_stats = shooter_stats.sort_values(by='Shots', ascending=False).head(10)
                
                # Format for display
                shooter_stats['xG'] = shooter_stats['xG'].round(2)
                
                # Set index to 1..N
                shooter_stats.index = np.arange(1, len(shooter_stats) + 1)
                
                st.dataframe(
                    shooter_stats, 
                    use_container_width=True,
                    column_config={
                        "player": "Player Name",
                        "Shots": st.column_config.NumberColumn("Shots", format="%d"),
                        "Goals": st.column_config.NumberColumn("Goals", format="%d"),
                        "xG": st.column_config.NumberColumn("xG", format="%.2f"),
                    }
                )
            else:
                st.info("No data available.")
        
    elif view_mode == "World Cup Heatmap":
        st.title("🌍 World Cup Heatmap")
        st.markdown("A global overview of where goals actually come from on the biggest stage, compared to our AI Danger Map.")
        
        # Calculate global metrics
        total_global_shots = len(df)
        total_global_goals = df['is_goal'].sum()
        total_global_xg = df['statsbomb_xg'].sum()
        
        col1, col2, col3 = st.columns(3)
        with col1:
            render_metric_card("Total Shots Evaluated", f"{total_global_shots:,}")
        with col2:
            render_metric_card("Total Goals Scored", f"{total_global_goals:,}")
        with col3:
            render_metric_card("Total Expected Goals", f"{total_global_xg:,.0f}")
            
        st.markdown("---")
        
        viz_col1, viz_col2 = st.columns(2)
        
        with viz_col1:
            st.subheader("Historical Goal Density")
            st.markdown("A KDE Heatmap of every World Cup goal in our database.")
            # Filter just goals for density plot
            all_goals = df[df['is_goal'] == 1]
            pitch, fig, ax = draw_pitch()
            plot_density_heatmap(all_goals, title="", ax=ax, pitch=pitch)
            st.pyplot(fig)
            
        with viz_col2:
            st.subheader("Theoretical Danger Map")
            st.markdown("The predicted scoring probability surface generated by our XGBoost AI.")
            # Load the danger map image
            img_path = 'images/danger_map.png'
            if not os.path.exists(img_path):
                img_path = '../images/danger_map.png'
            try:
                # `use_container_width` is preferred in newer Streamlit
                st.image(img_path, use_container_width=True)
            except:
                st.warning("Danger map image not found. Ensure Phase 6 was run successfully.")

if __name__ == "__main__":
    main()
