from typing import List, Dict, Any
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import torch
import torch.nn as nn


class SimpleHybridRecommender:
    def __init__(self):
        self.tfidf = TfidfVectorizer(max_features=2000, stop_words='english')
        self.movie_ids = []
        self.movie_meta = []
        self.content_matrix = None
        self.user_factors = None
        self.item_factors = None
        self.ratings_data = []  # Store ratings for content-based
        self.movie_id_to_index = {}  # Map movie IDs to matrix indices

    def fit_content(self, movies: List[Dict[str, Any]]):
        # movies: list of dicts with 'id', 'title', 'overview', and 'text' fields
        self.movie_ids = [m['id'] for m in movies]
        self.movie_meta = movies
        
        # Build movie ID to index mapping
        self.movie_id_to_index = {m['id']: idx for idx, m in enumerate(movies)}
        
        texts = [m.get('text', '') for m in movies]
        if texts:
            self.content_matrix = self.tfidf.fit_transform(texts)

    def train_collaborative(self, ratings: List[Dict[str, Any]], n_users=1000, n_items=1000, latent=32, epochs=50):
        # Store ratings for content-based filtering
        self.ratings_data = ratings
        
        # Build simple user-item matrix
        # Map ids to indices
        user_map = {}
        item_map = {}
        for r in ratings:
            uid = r['userId']; mid = r['movieId']
            if uid not in user_map: user_map[uid] = len(user_map)
            if mid not in item_map: item_map[mid] = len(item_map)
        U = len(user_map); M = len(item_map)
        if U == 0 or M == 0:
            self.user_factors = None; self.item_factors = None; return
        mat = np.zeros((U, M), dtype=np.float32)
        for r in ratings:
            mat[user_map[r['userId']], item_map[r['movieId']]] = r.get('score', 0)

        device = torch.device('cpu')
        P = torch.randn((U, latent), requires_grad=True, device=device)
        Q = torch.randn((M, latent), requires_grad=True, device=device)
        optimizer = torch.optim.Adam([P, Q], lr=0.05)
        target = torch.tensor(mat, device=device)

        for epoch in range(epochs):
            optimizer.zero_grad()
            pred = P @ Q.t()
            loss = ((pred - target) ** 2).mean()
            loss.backward()
            optimizer.step()

        self.user_factors = P.detach().numpy()
        self.item_factors = Q.detach().numpy()
        self.user_map = user_map
        self.item_map = item_map

    def collaborative_scores(self, user_id: int):
        """Get collaborative filtering scores for all movies"""
        if self.user_factors is None or user_id not in getattr(self, 'user_map', {}):
            return None
        
        uidx = self.user_map[user_id]
        # Get scores for all items in the collaborative model
        collab_item_scores = self.item_factors @ self.user_factors[uidx]
        
        # Map back to full movie list (pad with zeros for movies not in collaborative training)
        full_scores = np.zeros(len(self.movie_meta))
        for movie_id, item_idx in self.item_map.items():
            if movie_id in self.movie_id_to_index:
                full_idx = self.movie_id_to_index[movie_id]
                full_scores[full_idx] = collab_item_scores[item_idx]
        
        return full_scores
    
    def content_based_scores(self, user_id: int):
        """Get content-based filtering scores for all movies"""
        if self.content_matrix is None or len(self.ratings_data) == 0:
            return None
        
        # Find movies this user rated highly (score >= 7)
        user_ratings = [r for r in self.ratings_data if r['userId'] == user_id]
        if len(user_ratings) == 0:
            return None
        
        liked_movie_ids = [r['movieId'] for r in user_ratings if r.get('score', 0) >= 7]
        if len(liked_movie_ids) == 0:
            return None
        
        # Get content vectors for liked movies
        liked_indices = []
        for mid in liked_movie_ids:
            if mid in self.movie_id_to_index:
                liked_indices.append(self.movie_id_to_index[mid])
        
        if len(liked_indices) == 0:
            return None
        
        liked_vectors = self.content_matrix[liked_indices]
        
        # Create user profile (average of liked movies)
        user_profile = np.mean(liked_vectors.toarray(), axis=0)
        
        # Calculate similarity to all movies
        similarities = cosine_similarity([user_profile], self.content_matrix)[0]
        
        # Normalize to 0-10 scale for combining with collaborative
        scores = (similarities * 10).clip(0, 10)
        return scores
    
    def popular_recommendations(self, topk=10):
        """Return popular movies based on average ratings"""
        if len(self.ratings_data) == 0:
            # No ratings at all - return first movies
            return self.movie_meta[:topk]
        
        # Calculate average rating for each movie
        movie_ratings = {}
        movie_counts = {}
        for r in self.ratings_data:
            mid = r['movieId']
            score = r.get('score', 0)
            if mid not in movie_ratings:
                movie_ratings[mid] = 0
                movie_counts[mid] = 0
            movie_ratings[mid] += score
            movie_counts[mid] += 1
        
        # Calculate averages
        movie_avg = {mid: movie_ratings[mid] / movie_counts[mid] for mid in movie_ratings}
        
        # Sort by average rating
        sorted_movies = sorted(movie_avg.items(), key=lambda x: x[1], reverse=True)
        
        # Get top movies
        results = []
        for mid, avg_rating in sorted_movies[:topk]:
            if mid in self.movie_id_to_index:
                idx = self.movie_id_to_index[mid]
                m = self.movie_meta[idx]
                results.append({
                    'id': m.get('id'),
                    'title': m.get('title', 'Unknown'),
                    'overview': m.get('overview', ''),
                    'posterPath': m.get('posterPath', ''),
                    'explanation': f'Popular movie (avg rating: {avg_rating:.1f})'
                })
        
        return results

    def recommend_for_user(self, user_id: int, topk=10):
        """Hybrid recommendation combining collaborative and content-based filtering"""
        results = []
        
        # Get user's ratings count
        user_ratings = [r for r in self.ratings_data if r['userId'] == user_id]
        num_ratings = len(user_ratings)
        
        # NEW USER - no ratings
        if num_ratings == 0:
            return self.popular_recommendations(topk)
        
        # Get scores from both methods
        collab_scores = self.collaborative_scores(user_id)
        content_scores = self.content_based_scores(user_id)
        
        # Determine weighting based on number of ratings
        if num_ratings < 5:
            # Few ratings - prefer content-based (knows what they like)
            collab_weight = 0.4
            content_weight = 0.6
            method = "hybrid (content-focused)"
        else:
            # Many ratings - prefer collaborative (pattern learning)
            collab_weight = 0.7
            content_weight = 0.3
            method = "hybrid (collaborative-focused)"
        
        # HYBRID: Combine both scores
        if collab_scores is not None and content_scores is not None:
            # Both methods available - combine them
            final_scores = collab_weight * collab_scores + content_weight * content_scores
            explanation = f'Recommended by {method}'
        elif collab_scores is not None:
            # Only collaborative available (user hasn't rated enough movies highly for content-based)
            final_scores = collab_scores
            explanation = f'Recommended by {method} (collaborative only)'
        elif content_scores is not None:
            # Only content-based available
            final_scores = content_scores
            explanation = f'Recommended by {method} (content only)'
        else:
            # Neither method available - fall back to popular
            return self.popular_recommendations(topk)
        
        # Get top movies
        top_indices = np.argsort(-final_scores)[:topk]
        
        for idx in top_indices:
            if idx < len(self.movie_meta):
                m = self.movie_meta[idx]
                results.append({
                    'id': m.get('id'),
                    'title': m.get('title', 'Unknown'),
                    'overview': m.get('overview', ''),
                    'posterPath': m.get('posterPath', ''),
                    'explanation': explanation,
                    'score': float(final_scores[idx])
                })
        
        return results
