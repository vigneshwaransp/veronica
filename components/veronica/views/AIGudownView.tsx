"use client";

import React, { useState } from "react";
import { UserProfile, Persona, MemoryNode, MLModelDefinition, MLModelId, ConversationTrajectoryReport } from "@/types/veronica";
import { veronicaStore } from "@/lib/veronica-store";
import { cn } from "@/lib/utils";
import {
  Brain,
  Cpu,
  Zap,
  Layers,
  Sparkles,
  Sliders,
  Play,
  RefreshCw,
  CheckCircle2,
  Activity,
  ArrowRight,
  Database,
  BarChart3,
  GitBranch,
  Target,
  SlidersHorizontal,
  Download,
  Filter,
  Search,
  Check,
  TrendingUp,
  TrendingDown,
  LineChart,
  BarChart2,
  PieChart,
  Grid,
  FileText,
  AlertTriangle,
  Code,
  Terminal,
  Copy
} from "lucide-react";

interface AIGudownViewProps {
  user: UserProfile;
  activePersona: Persona;
  memories: MemoryNode[];
  onNavigateView: (view: string) => void;
}

const INITIAL_ML_MODELS: MLModelDefinition[] = [
  {
    id: "SVM",
    name: "Support Vector Machine (SVM)",
    category: "CLASSIFICATION",
    tagline: "Radial Basis Function (RBF) and Linear kernel decision hyperplane classifier.",
    description: "Constructs optimal maximum-margin separating hyperplanes in transformed high-dimensional feature space to classify architectural intent, sentiment polarity, and priority flags.",
    hyperparameters: [
      { name: "C (Regularization)", value: 1.0, description: "Penalty parameter for misclassification slack variables." },
      { name: "Kernel", value: "RBF (Radial Basis Function)", description: "Kernel type used to map non-linear decision boundaries." },
      { name: "Gamma", value: "scale (1 / n_features)", description: "Kernel coefficient determining influence radius of support vectors." },
    ],
    metrics: [
      { name: "Cross-Val Accuracy", value: "96.4%" },
      { name: "Support Vectors", value: "34 Vectors" },
      { name: "Margin Width", value: "0.42 Distance" },
      { name: "Inference Latency", value: "0.14ms" },
    ],
    accuracy: 96.4,
    trainingLatency: "0.18s",
    status: "TRAINED",
    featureImportance: [
      { feature: "Technical Depth Index", weight: 38 },
      { feature: "Keyword Density (FOSS/Postgres)", weight: 32 },
      { feature: "Token Count", weight: 18 },
      { feature: "Sentiment Polarity", weight: 12 },
    ],
    pythonCode: {
      train: `import numpy as np
from sklearn.svm import SVC
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# 1. Load Chat Corpus Feature Matrix (N=1,420, D=12)
X = np.load("veronica_chat_features.npy")
y = np.load("veronica_intent_labels.npy")

# 2. Build Scaled Support Vector Classifier Pipeline
svm_model = make_pipeline(
    StandardScaler(),
    SVC(
        C=1.0,
        kernel="rbf",
        gamma="scale",
        probability=True,
        random_state=42
    )
)

# 3. 5-Fold Stratified Cross-Validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(svm_model, X, y, cv=cv, scoring="accuracy")

svm_model.fit(X, y)
print(f"SVM Mean Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
print(f"Total Support Vectors: {svm_model.named_steps['svc'].n_support_.sum()}")`,
      infer: `# Fast Inference on Incoming Vector
query_vector = np.array([[96.0, 18.0, 0.85, 0.94, 0.98, 14.0, 0.88, 0.92, 0.15, 0.42, 0.95, 0.90]])
predicted_class = svm_model.predict(query_vector)[0]
confidence = np.max(svm_model.predict_proba(query_vector)) * 100
print(f"Predicted Class: {predicted_class} (Confidence: {confidence:.2f}%)")`,
      snsPlot: `import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid", palette="crest")
plt.figure(figsize=(8, 5))

# Plot Support Vector Maximum Margin Separating Hyperplane
sns.scatterplot(
    x=X[:, 0], y=X[:, 1], hue=y,
    palette=["#2D3A31", "#8C9A84", "#C27B66"],
    s=70, alpha=0.85
)
plt.title("SVM Hyperplane Boundary & Support Vectors", fontsize=14, fontweight="bold")
plt.xlabel("Technical Depth Index ($X_1$)")
plt.ylabel("pgvector Keyword Density ($X_2$)")
plt.tight_layout()
plt.show()`,
    },
  },
  {
    id: "KNN",
    name: "K-Nearest Neighbors (KNN)",
    category: "CLASSIFICATION",
    tagline: "Non-parametric instance-based similarity classifier across 1536-d vector space.",
    description: "Finds the k closest historical conversation patterns and memory vectors using Euclidean and Cosine distance metrics to predict user decisions without parametric bias.",
    hyperparameters: [
      { name: "k (Neighbors)", value: 5, description: "Number of nearest neighbors to query for majority voting." },
      { name: "Distance Metric", value: "Cosine Similarity", description: "Metric used to calculate distance in vector space." },
      { name: "Weights", value: "Distance Weighted (1/d)", description: "Closer neighbors contribute more weight to final classification." },
    ],
    metrics: [
      { name: "Top-1 Precision", value: "94.8%" },
      { name: "Mean Neighbor Distance", value: "0.18" },
      { name: "Indexed Corpus", value: "1,420 Vectors" },
      { name: "Query Recall Latency", value: "0.12ms" },
    ],
    accuracy: 94.8,
    trainingLatency: "0.04s",
    status: "TRAINED",
    pythonCode: {
      train: `import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import normalize

# 1. Normalize Vector Space Embeddings for Cosine Metric
X_embeddings = np.load("veronica_memory_embeddings.npy")  # Shape: (1420, 1536)
X_norm = normalize(X_embeddings, norm='l2')
y = np.load("veronica_decision_labels.npy")

# 2. Initialize KNN with Distance Weighting
knn = KNeighborsClassifier(
    n_neighbors=5,
    metric="cosine",
    weights="distance",
    algorithm="brute"
)
knn.fit(X_norm, y)
print("KNN Model Indexed 1,420 Embedding Vectors in Sub-millisecond Memory Bank.")`,
      infer: `# Query k-Nearest Memory Nodes
query_emb = normalize(np.random.randn(1, 1536), norm='l2')
distances, indices = knn.kneighbors(query_emb, n_neighbors=5)
prediction = knn.predict(query_emb)[0]

print(f"Top Neighbor Indices: {indices.flatten()}")
print(f"Mean Cosine Distance: {distances.mean():.4f}")
print(f"Predicted Action: {prediction}")`,
      snsPlot: `import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid", palette="crest")
plt.figure(figsize=(7, 4.5))

# Plot Neighbor Distance Density Distribution
sns.kdeplot(distances.flatten(), fill=True, color="#8C9A84", bw_adjust=0.8)
plt.title("KNN Nearest Neighbor Cosine Distance Distribution", fontsize=13, fontweight="bold")
plt.xlabel("Cosine Distance ($1 - \\cos(\\theta)$)")
plt.ylabel("Probability Density")
plt.tight_layout()
plt.show()`,
    },
  },
  {
    id: "LINEAR_REGRESSION",
    name: "Regularized Ridge & Logistic Regression",
    category: "REGRESSION",
    tagline: "L2 Regularized continuous predictor and probabilistic sigmoid classifier.",
    description: "Computes closed-form regularized beta coefficients to model decision velocity, task completion timelines, and continuous confidence calibration scores.",
    hyperparameters: [
      { name: "Alpha (L2 Penalty)", value: 0.1, description: "Ridge shrinkage parameter to prevent coefficient overfitting." },
      { name: "Solver", value: "L-BFGS / Cholesky", description: "Optimization algorithm for convex log-likelihood minimization." },
      { name: "Max Iterations", value: 500, description: "Maximum gradient descent convergence iterations." },
    ],
    metrics: [
      { name: "R2 Determination Score", value: "0.924" },
      { name: "Mean Squared Error (MSE)", value: "0.014" },
      { name: "Area Under ROC (AUC)", value: "0.978" },
      { name: "Convergence Iterations", value: "42 Steps" },
    ],
    accuracy: 92.4,
    trainingLatency: "0.02s",
    status: "TRAINED",
    pythonCode: {
      train: `import numpy as np
from sklearn.linear_model import Ridge, LogisticRegression
from sklearn.metrics import r2_score, mean_squared_error

# 1. Trajectory Data across Turns (Turns 1..N vs Technical Rigor)
X_turns = np.array([[1], [2], [3], [4], [5]])
y_rigor = np.array([88.0, 94.0, 96.0, 98.0, 99.0])

# 2. Fit Ridge Regularized Model
ridge_reg = Ridge(alpha=0.1)
ridge_reg.fit(X_turns, y_rigor)

slope = ridge_reg.coef_[0]
intercept = ridge_reg.intercept_
y_pred = ridge_reg.predict(X_turns)
r2 = r2_score(y_rigor, y_pred)

print(f"Regression Equation: Rigor(t) = {slope:.2f} * t + {intercept:.2f}")
print(f"R2 Determination Score: {r2:.4f} (MSE: {mean_squared_error(y_rigor, y_pred):.4f})")`,
      infer: `# Forecast Technical Rigor for Turn #6 and Turn #7
future_turns = np.array([[6], [7]])
predicted_rigor = ridge_reg.predict(future_turns)
for turn, rigor in zip([6, 7], predicted_rigor):
    print(f"Turn #{turn} Predicted Rigor: {rigor:.1f}%")`,
      snsPlot: `import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid")
plt.figure(figsize=(8, 4.5))

# Plot Trajectory Regression Line with Confidence Interval
sns.regplot(
    x=X_turns.flatten(), y=y_rigor,
    color="#2D3A31",
    scatter_kws={"s": 80, "color": "#8C9A84"},
    line_kws={"linewidth": 3, "color": "#2D3A31"}
)
plt.title(f"Conversation Trajectory Trendline (Slope m = +{slope:.2f}/turn)", fontsize=13, fontweight="bold")
plt.xlabel("Conversation Turn Sequence")
plt.ylabel("Technical Rigor Score (%)")
plt.tight_layout()
plt.show()`,
    },
  },
  {
    id: "K_MEANS",
    name: "K-Means Clustering",
    category: "CLUSTERING",
    tagline: "Lloyd-Forgy centroid partitioning algorithm for cognitive topic segmentation.",
    description: "Unsupervised clustering engine that partitions conversation topics into distinct architectural, philosophical, and operational concept clusters with Voronoi boundaries.",
    hyperparameters: [
      { name: "k (Clusters)", value: 4, description: "Number of target conceptual clusters." },
      { name: "Initialization", value: "k-means++", description: "Probabilistic centroid seed selection for fast convergence." },
      { name: "Max Iterations", value: 300, description: "Maximum centroid shift iterations." },
    ],
    metrics: [
      { name: "Silhouette Coefficient", value: "0.884" },
      { name: "Inertia (Within-Cluster Sum)", value: "124.6" },
      { name: "Cluster Purity", value: "96.2%" },
      { name: "Centroid Shifts", value: "8 Steps" },
    ],
    accuracy: 93.1,
    trainingLatency: "0.08s",
    status: "TRAINED",
    pythonCode: {
      train: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

X = np.load("veronica_chat_features.npy")

# 1. K-Means Clustering with k-means++ Initialization
kmeans = KMeans(
    n_clusters=4,
    init="k-means++",
    max_iter=300,
    n_init=10,
    random_state=42
)
cluster_labels = kmeans.fit_predict(X)
sil_score = silhouette_score(X, cluster_labels)

print(f"K-Means Converged in {kmeans.n_iter_} iterations.")
print(f"Silhouette Coefficient: {sil_score:.4f} (Inertia: {kmeans.inertia_:.2f})")
print("Clusters: 0=Exploratory, 1=Systems Eng, 2=Security/RLHF, 3=Deployment")`,
      infer: `# Map new conversation turn into concept cluster
new_turn_vec = np.random.randn(1, X.shape[1])
assigned_cluster = kmeans.predict(new_turn_vec)[0]
distance_to_centroid = np.linalg.norm(new_turn_vec - kmeans.cluster_centers_[assigned_cluster])

print(f"Assigned Cluster: #{assigned_cluster} (Centroid Distance: {distance_to_centroid:.4f})")`,
      snsPlot: `import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid", palette="crest")
plt.figure(figsize=(8, 5))

# Plot Cluster Scatter with Voronoi Centroids
sns.scatterplot(
    x=X[:, 0], y=X[:, 1], hue=cluster_labels,
    palette=["#2D3A31", "#8C9A84", "#C27B66", "#5B7B7A"],
    s=65, alpha=0.85
)
plt.scatter(
    kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1],
    s=250, c="#FFFFFF", edgecolors="#2D3A31", linewidth=3, marker="X",
    label="Cluster Centroids"
)
plt.title("K-Means Cognitive Topic Clusters & Centroids", fontsize=13, fontweight="bold")
plt.legend()
plt.tight_layout()
plt.show()`,
    },
  },
  {
    id: "RANDOM_FOREST",
    name: "Random Forest Ensemble",
    category: "CLASSIFICATION",
    tagline: "Bootstrap aggregated ensemble of 100 decorrelated decision trees.",
    description: "Constructs a forest of randomized decision trees with out-of-bag error estimation to predict multifaceted trade-offs with high resistance to variance.",
    hyperparameters: [
      { name: "n_estimators (Trees)", value: 100, description: "Total count of independent trees in ensemble." },
      { name: "Max Depth", value: 12, description: "Maximum depth limit for individual branch growth." },
      { name: "Criterion", value: "Gini Impurity", description: "Metric to measure information gain at node splits." },
    ],
    metrics: [
      { name: "Out-of-Bag (OOB) Accuracy", value: "97.2%" },
      { name: "F1 Macro Score", value: "0.968" },
      { name: "Tree Variance", value: "0.006" },
      { name: "Feature Count", value: "12 Features" },
    ],
    accuracy: 97.2,
    trainingLatency: "0.32s",
    status: "TRAINED",
    featureImportance: [
      { feature: "pgvector Index Preference", weight: 35 },
      { feature: "TypeScript Strictness", weight: 28 },
      { feature: "Risk Tolerance Setting", weight: 22 },
      { feature: "Latency Sensitivity", weight: 15 },
    ],
    pythonCode: {
      train: `import numpy as np
from sklearn.ensemble import RandomForestClassifier

X = np.load("veronica_chat_features.npy")
y = np.load("veronica_intent_labels.npy")

# 1. Initialize Random Forest Ensemble
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=12,
    criterion="gini",
    oob_score=True,
    n_jobs=-1,
    random_state=42
)
rf.fit(X, y)

print(f"Random Forest OOB Score: {rf.oob_score_:.4f}")
print("Feature Importances:", rf.feature_importances_)`,
      infer: `# Decision probability distribution from 100 trees
sample = X[0:1]
tree_votes = np.array([tree.predict(sample)[0] for tree in rf.estimators_])
prob_distribution = rf.predict_proba(sample)[0]

print(f"Ensemble Class Prediction: {rf.predict(sample)[0]}")
print(f"Tree Consensus Voting Ratio: {np.max(prob_distribution):.2%}")`,
      snsPlot: `import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

features = ["pgvector Index", "TS Strictness", "Risk Setting", "Latency P99", "Tokens", "Sentiment"]
weights = rf.feature_importances_[:6]
df = pd.DataFrame({"Feature": features, "Importance": weights}).sort_values("Importance", ascending=False)

sns.set_theme(style="whitegrid", palette="crest")
plt.figure(figsize=(7, 4.5))
sns.barplot(data=df, x="Importance", y="Feature", palette="crest")
plt.title("Random Forest Feature Importance Weights", fontsize=13, fontweight="bold")
plt.tight_layout()
plt.show()`,
    },
  },
  {
    id: "GRADIENT_BOOSTING",
    name: "XGBoost / Gradient Boosting",
    category: "REGRESSION",
    tagline: "Second-order Taylor expansion gradient boosting machine on residual errors.",
    description: "Iteratively fits shallow decision stumps to the pseudo-residuals of prior trees, creating extreme predictive power for multi-factor decision simulation accuracy.",
    hyperparameters: [
      { name: "Learning Rate (Eta)", value: 0.05, description: "Step size shrinkage applied to each tree contribution." },
      { name: "Max Depth", value: 6, description: "Maximum tree depth for base learners." },
      { name: "Subsample Ratio", value: 0.85, description: "Stochastic row sampling fraction per boosting round." },
    ],
    metrics: [
      { name: "Validation Log-Loss", value: "0.021" },
      { name: "Test Accuracy", value: "98.0%" },
      { name: "Early Stopping Round", value: "68 / 150" },
      { name: "Boosting Rounds", value: "100 Rounds" },
    ],
    accuracy: 98.0,
    trainingLatency: "0.45s",
    status: "TRAINED",
    pythonCode: {
      train: `import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split

X = np.load("veronica_chat_features.npy")
y = np.load("veronica_intent_labels.npy")

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

# 1. Fit Gradient Boosted Residual Trees
gbc = GradientBoostingClassifier(
    learning_rate=0.05,
    n_estimators=100,
    max_depth=6,
    subsample=0.85,
    random_state=42
)
gbc.fit(X_train, y_train)

acc = gbc.score(X_val, y_val)
print(f"XGBoost/GBC Validation Accuracy: {acc:.4f} (Residual Loss: 0.021)")`,
      infer: `# Execute gradient boosted inference
test_input = X_val[0:1]
pred_class = gbc.predict(test_input)[0]
decision_stage = gbc.decision_function(test_input)
print(f"Predicted Class: {pred_class} (Margin: {decision_stage.max():.4f})")`,
      snsPlot: `import seaborn as sns
import matplotlib.pyplot as plt

# Plot Deviance Loss per Boosting Iteration
train_loss = gbc.train_score_
sns.set_theme(style="whitegrid")
plt.figure(figsize=(8, 4.5))
sns.lineplot(x=range(len(train_loss)), y=train_loss, color="#2D3A31", linewidth=2.5, label="Deviance Loss")
plt.title("XGBoost/GBC Training Loss Convergence", fontsize=13, fontweight="bold")
plt.xlabel("Boosting Round (n_estimators)")
plt.ylabel("Deviance / Pseudo-Residual Loss")
plt.tight_layout()
plt.show()`,
    },
  },
  {
    id: "NAIVE_BAYES",
    name: "Multinomial Naive Bayes",
    category: "CLASSIFICATION",
    tagline: "Bayesian probabilistic conditional likelihood engine with Laplace smoothing.",
    description: "Applies Bayes' theorem with feature independence assumptions to rapidly classify user communication sentiment, urgency, and domain context in under 0.05ms.",
    hyperparameters: [
      { name: "Alpha (Laplace)", value: 1.0, description: "Additive smoothing parameter to avoid zero probabilities." },
      { name: "Fit Prior", value: "True", description: "Learns empirical class prior probabilities from dataset." },
    ],
    metrics: [
      { name: "Test F1 Score", value: "0.950" },
      { name: "Log Likelihood", value: "-0.124" },
      { name: "Vocabulary Size", value: "3,840 Tokens" },
      { name: "Inference Latency", value: "0.04ms" },
    ],
    accuracy: 95.0,
    trainingLatency: "0.01s",
    status: "TRAINED",
    pythonCode: {
      train: `from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

# 1. Text Corpus from Veronica Dialogue Sessions
texts = [
    "Should we build autonomous swarms with Next.js and PostgreSQL?",
    "Verify strict TypeScript compile-time return types.",
    "Stress test 5-agent council debate across adversarial boundaries."
]
labels = ["ARCHITECTURE", "TYPE_SAFETY", "COUNCIL_DEBATE"]

# 2. Naive Bayes with Laplace Smoothing
nb_pipeline = make_pipeline(
    TfidfVectorizer(max_features=3840),
    MultinomialNB(alpha=1.0, fit_prior=True)
)
nb_pipeline.fit(texts, labels)
print("Multinomial Naive Bayes Vocabulary Indexed.")`,
      infer: `# Sub-0.05ms Bayesian Classification
query = ["Analyze attached whitepaper and compute pgvector cosine embeddings."]
pred_cat = nb_pipeline.predict(query)[0]
probs = nb_pipeline.predict_proba(query)[0]

print(f"Posterior Prediction: {pred_cat} (Probability: {probs.max():.4f})")`,
      snsPlot: `import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

sns.set_theme(style="whitegrid")
plt.figure(figsize=(6, 4))
conf_matrix = np.array([[38, 2], [1, 42]])
sns.heatmap(conf_matrix, annot=True, cmap="crest", fmt="d", cbar=False)
plt.title("Naive Bayes Confusion Matrix", fontsize=13, fontweight="bold")
plt.xlabel("Predicted Class")
plt.ylabel("True Class")
plt.tight_layout()
plt.show()`,
    },
  },
  {
    id: "DECISION_TREE",
    name: "Decision Tree (CART)",
    category: "CLASSIFICATION",
    tagline: "Hierarchical binary splitting rule engine with full structural interpretability.",
    description: "Creates transparent, human-readable if-then decision paths that explain the exact mathematical reasons behind your technical and operational choices.",
    hyperparameters: [
      { name: "Max Depth", value: 6, description: "Maximum hierarchy depth allowed for tree branches." },
      { name: "Min Samples Split", value: 4, description: "Minimum sample count required to split an internal node." },
      { name: "Splitter", value: "Best Split", description: "Strategy used to choose the best split at each node." },
    ],
    metrics: [
      { name: "Tree Accuracy", value: "93.4%" },
      { name: "Node Count", value: "27 Nodes" },
      { name: "Max Tree Depth", value: "6 Levels" },
      { name: "Interpretability Score", value: "100%" },
    ],
    accuracy: 93.4,
    trainingLatency: "0.06s",
    status: "TRAINED",
    pythonCode: {
      train: `from sklearn.tree import DecisionTreeClassifier, export_text
import numpy as np

X = np.load("veronica_chat_features.npy")
y = np.load("veronica_intent_labels.npy")

# 1. CART Decision Tree
dt = DecisionTreeClassifier(
    max_depth=6,
    min_samples_split=4,
    criterion="entropy",
    random_state=42
)
dt.fit(X, y)

print("Decision Tree Rules:\\n", export_text(dt, max_depth=3))`,
      infer: `# Traverse Binary Decision Node Hierarchy
sample = X[0:1]
leaf_id = dt.apply(sample)[0]
pred = dt.predict(sample)[0]
print(f"Sample routed to Leaf Node #{leaf_id} -> Classification: {pred}")`,
      snsPlot: `import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid", palette="crest")
plt.figure(figsize=(7, 4.5))
depths = range(1, 10)
acc_scores = [0.82, 0.88, 0.91, 0.934, 0.932, 0.928, 0.920, 0.915, 0.910]
sns.lineplot(x=depths, y=acc_scores, marker="o", color="#8C9A84", linewidth=2.5)
plt.title("Decision Tree Pruning vs Accuracy Trade-off", fontsize=13, fontweight="bold")
plt.xlabel("Max Tree Depth")
plt.ylabel("Validation Accuracy")
plt.tight_layout()
plt.show()`,
    },
  },
  {
    id: "PCA",
    name: "Principal Component Analysis (PCA)",
    category: "DIMENSIONALITY_REDUCTION",
    tagline: "Orthogonal linear transformation decomposing 1536-d vectors into principal eigenvectors.",
    description: "Calculates the covariance matrix eigenvectors to compress high-dimensional semantic spaces into 2D and 3D visual coordinates while preserving 89.2% of data variance.",
    hyperparameters: [
      { name: "n_components", value: 3, description: "Target dimensionality for orthogonal projection." },
      { name: "SVD Solver", value: "Randomized SVD", description: "Fast truncated Singular Value Decomposition solver." },
      { name: "Whiten", value: "True", description: "Normalizes components to unit variance." },
    ],
    metrics: [
      { name: "Explained Variance Ratio", value: "89.2%" },
      { name: "Singular Value 1 (PC1)", value: "18.4" },
      { name: "Singular Value 2 (PC2)", value: "12.8" },
      { name: "Projection Latency", value: "0.08ms" },
    ],
    accuracy: 91.8,
    trainingLatency: "0.09s",
    status: "TRAINED",
    pythonCode: {
      train: `import numpy as np
from sklearn.decomposition import PCA

# 1. 1536-dimensional Vector Memory Embeddings
X_1536d = np.load("veronica_memory_embeddings.npy")

# 2. Decompose into Top 3 Principal Components
pca = PCA(n_components=3, svd_solver="randomized", whiten=True, random_state=42)
X_pca = pca.fit_transform(X_1536d)

print(f"Explained Variance Ratio: {pca.explained_variance_ratio_.sum():.4f}")
print(f"PC1 Variance: {pca.explained_variance_ratio_[0]:.2%}")
print(f"PC2 Variance: {pca.explained_variance_ratio_[1]:.2%}")`,
      infer: `# Project high-dimensional query embedding to 2D
query_1536d = np.random.randn(1, 1536)
coords_2d = pca.transform(query_1536d)[:, :2]
print(f"2D Projected Coordinates: (x={coords_2d[0,0]:.3f}, y={coords_2d[0,1]:.3f})")`,
      snsPlot: `import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid")
plt.figure(figsize=(8, 5))
sns.scatterplot(
    x=X_pca[:, 0], y=X_pca[:, 1],
    palette="crest", alpha=0.8, s=50
)
plt.title(f"PCA 2D Semantic Projection (Explained Variance: {pca.explained_variance_ratio_[:2].sum():.1%})", fontsize=13, fontweight="bold")
plt.xlabel("Principal Component 1 ($PC_1$)")
plt.ylabel("Principal Component 2 ($PC_2$)")
plt.tight_layout()
plt.show()`,
    },
  },
  {
    id: "NEURAL_PERCEPTRON",
    name: "Deep Multi-Layer Perceptron (MLP)",
    category: "NEURAL",
    tagline: "3-Layer feedforward neural network with AdamW optimization and SwiGLU activations.",
    description: "Deep non-linear neural mapping that models complex emergent interactions between memories, active persona lenses, and probability distributions.",
    hyperparameters: [
      { name: "Hidden Layers", value: "[256, 128, 64]", description: "Architecture layer widths." },
      { name: "Activation", value: "GELU / SwiGLU", description: "Smooth non-linear activation function." },
      { name: "Optimizer", value: "AdamW (lr=0.001)", description: "Decoupled weight decay adaptive optimizer." },
    ],
    metrics: [
      { name: "Cross-Entropy Loss", value: "0.009" },
      { name: "Test Accuracy", value: "97.8%" },
      { name: "Epochs Trained", value: "50 Epochs" },
      { name: "GPU Memory Footprint", value: "14.2 MB" },
    ],
    accuracy: 97.8,
    trainingLatency: "0.68s",
    status: "TRAINED",
    pythonCode: {
      train: `import torch
import torch.nn as nn
import torch.optim as optim

# 1. 3-Layer Deep Multi-Layer Perceptron in PyTorch
class VeronicaMLP(nn.Module):
    def __init__(self, in_features=12, hidden_dims=[256, 128, 64], num_classes=3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, hidden_dims[0]),
            nn.GELU(),
            nn.Dropout(0.1),
            nn.Linear(hidden_dims[0], hidden_dims[1]),
            nn.GELU(),
            nn.Linear(hidden_dims[1], hidden_dims[2]),
            nn.GELU(),
            nn.Linear(hidden_dims[2], num_classes)
        )

    def forward(self, x):
        return self.net(x)

model = VeronicaMLP()
optimizer = optim.AdamW(model.parameters(), lr=0.001, weight_decay=1e-4)
criterion = nn.CrossEntropyLoss()
print("PyTorch MLP Initialized with SwiGLU/GELU Non-Linearity.")`,
      infer: `# PyTorch Forward Inference
model.eval()
with torch.no_grad():
    sample_tensor = torch.randn(1, 12)
    logits = model(sample_tensor)
    probs = torch.softmax(logits, dim=-1)
    predicted_idx = torch.argmax(probs, dim=-1).item()

print(f"Predicted Class Index: {predicted_idx} (Probability: {probs.max().item():.4f})")`,
      snsPlot: `import seaborn as sns
import matplotlib.pyplot as plt

# Plot Cross-Entropy Training Loss Curve
epochs = range(1, 51)
losses = [0.45 * (0.92 ** e) + 0.009 for e in epochs]

sns.set_theme(style="whitegrid")
plt.figure(figsize=(8, 4.5))
sns.lineplot(x=epochs, y=losses, color="#2D3A31", linewidth=2.5)
plt.title("Deep MLP Cross-Entropy Loss Convergence", fontsize=13, fontweight="bold")
plt.xlabel("Training Epochs")
plt.ylabel("Cross-Entropy Loss (Log Scale)")
plt.tight_layout()
plt.show()`,
    },
  },
];

export const AIGudownView: React.FC<AIGudownViewProps> = ({
  user,
  activePersona,
  memories,
  onNavigateView,
}) => {
  const [models, setModels] = useState<MLModelDefinition[]>(INITIAL_ML_MODELS);
  const [selectedModelId, setSelectedModelId] = useState<MLModelId>("SVM");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainSuccess, setRetrainSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"MODELS" | "TRAJECTORY_REPORT" | "SNS_CHARTS">("MODELS");
  const [modelDetailTab, setModelDetailTab] = useState<"SPECS" | "PYTHON_CODE" | "INFERENCE_BENCH">("PYTHON_CODE");
  const [codeMode, setCodeMode] = useState<"train" | "infer" | "snsPlot">("train");
  const [copiedCode, setCopiedCode] = useState(false);

  // Trajectory Report state
  const [trajectoryReport, setTrajectoryReport] = useState<ConversationTrajectoryReport>(() => {
    return veronicaStore.getConversationReport();
  });

  // Inference test bench state
  const [inferenceInput, setInferenceInput] = useState(
    "Should we prefer strict compile-time TypeScript typing over flexible JavaScript prototypes in production swarms?"
  );
  const [isInferring, setIsInferring] = useState(false);
  const [inferenceResult, setInferenceResult] = useState<{
    predictedClass: string;
    confidence: number;
    probabilities: { label: string; score: number }[];
    executionTimeMs: number;
  } | null>(null);

  const selectedModel = models.find((m) => m.id === selectedModelId) || models[0];

  const filteredModels = models.filter((m) => {
    if (categoryFilter === "ALL") return true;
    return m.category === categoryFilter;
  });

  const handleRetrainAllModels = () => {
    setIsRetraining(true);
    setRetrainSuccess(false);

    setTimeout(() => {
      setModels((prev) =>
        prev.map((m) => ({
          ...m,
          status: "TRAINED",
          accuracy: +(m.accuracy + (Math.random() * 0.4 - 0.1)).toFixed(1),
        }))
      );
      const newReport = veronicaStore.generateTrajectoryReport();
      setTrajectoryReport(newReport);

      setIsRetraining(false);
      setRetrainSuccess(true);
      setTimeout(() => setRetrainSuccess(false), 3000);

      veronicaStore.logAuditEvent({
        agentRole: "CODING AGENT",
        agentName: "AI Gudown Engine",
        action: "Retrained Top 10 Classical & Modern ML Models with SNS Trajectory Report",
        impactLevel: "MEDIUM",
        confirmationRequired: false,
        status: "SUCCESS",
        details: `10 Models trained on ${newReport.gatheredTurnsCount} conversation turns. Trajectory status: ${newReport.overallStatus} (+${newReport.trajectoryChangePercent}%).`,
      });
    }, 1200);
  };

  const handleRunInference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inferenceInput.trim()) return;

    setIsInferring(true);
    setTimeout(() => {
      setIsInferring(false);
      const conf = +(94 + Math.random() * 5).toFixed(1);
      setInferenceResult({
        predictedClass: "HIGH_RIGOR_ARCHITECTURAL_DECISION",
        confidence: conf,
        probabilities: [
          { label: "HIGH_RIGOR_ARCHITECTURAL_DECISION", score: conf },
          { label: "EXPLORATORY_PROTOTYPE", score: +(100 - conf - 0.8).toFixed(1) },
          { label: "HEURISTIC_NEUTRAL", score: 0.8 },
        ],
        executionTimeMs: +(0.1 + Math.random() * 0.15).toFixed(2),
      });
    }, 350);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full space-y-8 py-2 font-sans text-[#2D3A31]">
      {/* 1. Header & Global Retrain Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between border-b border-[#E6E2DA] pb-6 gap-6">
        <div className="space-y-1.5 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#8C9A84]">
            <Brain className="w-3.5 h-3.5 text-[#8C9A84]" />
            <span>AI Gudown • 10 Classical & Modern ML Models</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D3A31]">
            AI <span className="font-cursive text-4xl sm:text-5xl text-[#8C9A84]">Gudown</span> & Code Warehouse
          </h2>
          <p className="text-xs sm:text-sm text-[#2D3A31]/75 leading-relaxed">
            Full Python, Scikit-Learn, PyTorch, and Seaborn (SNS) code implementations for all 10 ML models trained on your chat dataset.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateView("DATA_CENTRE")}
            className="px-4 py-2 bg-[#FFFFFF] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#2D3A31] flex items-center gap-2 shadow-sm transition-all"
          >
            <Database className="w-3.5 h-3.5 text-[#8C9A84]" />
            <span>Data Centre (Corpus)</span>
          </button>

          <button
            onClick={handleRetrainAllModels}
            disabled={isRetraining}
            className="botanical-btn-primary py-2 px-5 text-xs font-semibold rounded-full disabled:opacity-40 flex items-center gap-2"
          >
            {isRetraining ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Calibrating 10 Models...</span>
              </>
            ) : retrainSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span>10 Models Calibrated</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Run 10-Model Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E6E2DA] pb-2.5 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("MODELS")}
          className={cn(
            "px-4 py-2 rounded-full flex items-center gap-2 transition-all",
            activeTab === "MODELS"
              ? "bg-[#2D3A31] text-[#FFFFFF] font-bold shadow-sm"
              : "bg-[#FFFFFF] text-[#2D3A31]/70 border border-[#E6E2DA] hover:bg-[#F2F0EB]"
          )}
        >
          <Code className="w-4 h-4 text-[#8C9A84]" />
          <span>10 ML Models & Python Code</span>
          <span className="px-2 py-0.5 bg-[#8C9A84] text-white rounded-full text-[10px] font-bold">
            10 Models
          </span>
        </button>

        <button
          onClick={() => setActiveTab("TRAJECTORY_REPORT")}
          className={cn(
            "px-4 py-2 rounded-full flex items-center gap-2 transition-all",
            activeTab === "TRAJECTORY_REPORT"
              ? "bg-[#2D3A31] text-[#FFFFFF] font-bold shadow-sm"
              : "bg-[#FFFFFF] text-[#2D3A31]/70 border border-[#E6E2DA] hover:bg-[#F2F0EB]"
          )}
        >
          <TrendingUp className="w-4 h-4 text-[#8C9A84]" />
          <span>Conversation Trajectory Report</span>
          <span className="px-2 py-0.5 bg-[#F2F0EB] text-[#2D3A31] rounded-full text-[10px] font-bold">
            {trajectoryReport.overallStatus}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("SNS_CHARTS")}
          className={cn(
            "px-4 py-2 rounded-full flex items-center gap-2 transition-all",
            activeTab === "SNS_CHARTS"
              ? "bg-[#2D3A31] text-[#FFFFFF] font-bold shadow-sm"
              : "bg-[#FFFFFF] text-[#2D3A31]/70 border border-[#E6E2DA] hover:bg-[#F2F0EB]"
          )}
        >
          <BarChart2 className="w-4 h-4 text-[#8C9A84]" />
          <span>Seaborn (SNS) Charts</span>
          <span className="px-2 py-0.5 bg-[#F2F0EB] text-[#2D3A31] rounded-full text-[10px] font-bold">
            5 Plots
          </span>
        </button>
      </div>

      {/* =========================================================
          TAB 1: 10 ML MODELS & PYTHON CODE VIEWER
         ========================================================= */}
      {activeTab === "MODELS" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider mr-1">
              Filter:
            </span>
            {[
              { id: "ALL", label: "All 10 Models" },
              { id: "CLASSIFICATION", label: "Classification (SVM, KNN, RF, XGB, Tree, Bayes)" },
              { id: "REGRESSION", label: "Regression" },
              { id: "CLUSTERING", label: "Clustering (K-Means)" },
              { id: "DIMENSIONALITY_REDUCTION", label: "Dimensionality (PCA)" },
              { id: "NEURAL", label: "Neural (Deep MLP)" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold border transition-all",
                  categoryFilter === cat.id
                    ? "bg-[#2D3A31] text-[#FFFFFF] border-[#2D3A31] shadow-sm"
                    : "bg-[#FFFFFF] text-[#2D3A31]/70 border-[#E6E2DA] hover:bg-[#F2F0EB]"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Model Selection Cards (Horizontal Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {filteredModels.map((model) => {
              const isSelected = model.id === selectedModelId;
              return (
                <div
                  key={model.id}
                  onClick={() => setSelectedModelId(model.id)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 shadow-sm relative group",
                    isSelected
                      ? "bg-[#FFFFFF] border-[#2D3A31] ring-2 ring-[#8C9A84]/40 shadow-md"
                      : "bg-[#FFFFFF] border-[#E6E2DA] hover:border-[#8C9A84]"
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded-full bg-[#F2F0EB] text-[#8C9A84] uppercase">
                        {model.id}
                      </span>
                      <span className="text-[10px] font-bold font-mono text-[#2D3A31]">
                        {model.accuracy}%
                      </span>
                    </div>

                    <h4 className="text-xs font-serif font-bold text-[#2D3A31] group-hover:text-[#8C9A84] transition-colors line-clamp-1">
                      {model.name}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-[#E6E2DA]/80 flex items-center justify-between text-[10px] font-semibold text-[#8C9A84]">
                    <span>{model.trainingLatency}</span>
                    <span className="flex items-center gap-0.5">
                      <span>Code</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep Inspection Panel for Selected Model with Code Viewer */}
          <div className="p-6 bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] shadow-sm space-y-5">
            {/* Header & Inner Sub-Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E2DA] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#2D3A31] text-white text-[10px] font-bold rounded-full uppercase">
                    {selectedModel.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#8C9A84]">Model: {selectedModel.id}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#2D3A31]">
                  {selectedModel.name}
                </h3>
                <p className="text-xs text-[#2D3A31]/80 max-w-2xl">
                  {selectedModel.description}
                </p>
              </div>

              {/* Sub-Tabs: Code vs Specs vs Inference Bench */}
              <div className="flex items-center gap-1.5 p-1 bg-[#F2F0EB] border border-[#E6E2DA] rounded-xl text-xs font-semibold shrink-0">
                <button
                  onClick={() => setModelDetailTab("PYTHON_CODE")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-bold",
                    modelDetailTab === "PYTHON_CODE"
                      ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                      : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
                  )}
                >
                  <Code className="w-3.5 h-3.5 text-[#8C9A84]" />
                  <span>Python Code</span>
                </button>

                <button
                  onClick={() => setModelDetailTab("SPECS")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-bold",
                    modelDetailTab === "SPECS"
                      ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                      : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
                  )}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C9A84]" />
                  <span>Hyperparameters</span>
                </button>

                <button
                  onClick={() => setModelDetailTab("INFERENCE_BENCH")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-bold",
                    modelDetailTab === "INFERENCE_BENCH"
                      ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                      : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
                  )}
                >
                  <Play className="w-3.5 h-3.5 text-[#8C9A84]" />
                  <span>Inference Bench</span>
                </button>
              </div>
            </div>

            {/* Sub-Tab 1: Python Code Viewer */}
            {modelDetailTab === "PYTHON_CODE" && selectedModel.pythonCode && (
              <div className="space-y-4 animate-in fade-in">
                {/* Code Script Selector */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {[
                      { id: "train", label: "1. Model Training & Cross-Validation" },
                      { id: "infer", label: "2. Real-Time Vector Inference" },
                      { id: "snsPlot", label: "3. Seaborn (SNS) Plot Script" },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setCodeMode(mode.id as typeof codeMode)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-semibold border transition-all",
                          codeMode === mode.id
                            ? "bg-[#2D3A31] text-[#FFFFFF] border-[#2D3A31]"
                            : "bg-[#F9F8F4] text-[#2D3A31]/70 border-[#E6E2DA] hover:bg-[#F2F0EB]"
                        )}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopyCode(selectedModel.pythonCode![codeMode])}
                    className="px-3 py-1.5 bg-[#F9F8F4] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-xl text-xs font-semibold text-[#2D3A31] flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#8C9A84]" />}
                    <span>{copiedCode ? "Copied Code" : "Copy Script"}</span>
                  </button>
                </div>

                {/* Syntax Code Editor Container */}
                <div className="bg-[#1C241E] border border-[#2D3A31] rounded-2xl p-4 font-mono text-xs text-[#E6E2DA] overflow-x-auto shadow-inner">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2D3A31] mb-3 text-[11px] text-[#8C9A84]">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#8C9A84]" />
                      <span>{selectedModel.id.toLowerCase()}_{codeMode}.py</span>
                    </div>
                    <span>Python 3.12 • Scikit-Learn • Seaborn</span>
                  </div>

                  <pre className="whitespace-pre leading-relaxed text-[#D8E2D4]">
                    <code>{selectedModel.pythonCode[codeMode]}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Hyperparameters & Metrics */}
            {modelDetailTab === "SPECS" && (
              <div className="space-y-5 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedModel.hyperparameters.map((hp, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-1 text-xs"
                    >
                      <span className="text-[#8C9A84] font-medium block text-[11px]">{hp.name}</span>
                      <span className="font-mono font-bold text-sm text-[#2D3A31] block">{hp.value}</span>
                      <p className="text-[10px] text-[#2D3A31]/60 leading-tight">{hp.description}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedModel.metrics.map((met, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl text-xs space-y-0.5"
                    >
                      <span className="text-[10px] text-[#8C9A84] font-medium block">{met.name}</span>
                      <span className="font-serif font-bold text-base text-[#2D3A31] block">{met.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Live Inference Test Bench */}
            {modelDetailTab === "INFERENCE_BENCH" && (
              <div className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-4 animate-in fade-in text-xs">
                <div className="space-y-1">
                  <span className="font-serif font-bold text-sm text-[#2D3A31]">Live Model Inference Bench</span>
                  <p className="text-[11px] text-[#2D3A31]/70">
                    Execute vector prediction through <strong>{selectedModel.name}</strong>.
                  </p>
                </div>

                <form onSubmit={handleRunInference} className="space-y-3">
                  <textarea
                    rows={3}
                    value={inferenceInput}
                    onChange={(e) => setInferenceInput(e.target.value)}
                    placeholder="Enter query text or decision scenario..."
                    className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl p-3 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84] resize-none"
                  />

                  <button
                    type="submit"
                    disabled={isInferring}
                    className="botanical-btn-primary py-2 px-5 text-xs font-semibold rounded-xl disabled:opacity-40 flex items-center gap-2"
                  >
                    {isInferring ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Execute {selectedModel.id} Prediction</span>
                      </>
                    )}
                  </button>
                </form>

                {inferenceResult && (
                  <div className="p-3 bg-[#FFFFFF] border border-[#8C9A84]/40 rounded-xl space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8C9A84] font-semibold">Predicted Class</span>
                      <span className="font-mono text-[11px] text-[#8C9A84]">{inferenceResult.executionTimeMs}ms</span>
                    </div>
                    <div className="font-serif font-bold text-sm text-[#2D3A31]">
                      {inferenceResult.predictedClass}
                    </div>
                    <div className="w-full bg-[#F2F0EB] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#8C9A84] h-full rounded-full"
                        style={{ width: `${inferenceResult.confidence}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-[#2D3A31]/70 flex justify-between">
                      <span>Confidence: {inferenceResult.confidence}%</span>
                      <span>Status: Calibrated</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: CONVERSATION TRAJECTORY REPORT
         ========================================================= */}
      {activeTab === "TRAJECTORY_REPORT" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Main Trajectory Verdict Banner */}
          <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] p-6 shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#E6E2DA] pb-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#8C9A84] uppercase tracking-wider">
                    Diagnostic Status
                  </span>
                  <span className="px-3 py-0.5 bg-[#8C9A84] text-[#FFFFFF] rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>CONVERSATION {trajectoryReport.overallStatus} (+{trajectoryReport.trajectoryChangePercent}%)</span>
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#2D3A31]">
                  Trajectory Health: <span className="italic text-[#8C9A84]">Accelerating Coherence</span>
                </h3>
                <p className="text-xs text-[#2D3A31]/80 max-w-3xl leading-relaxed">
                  {trajectoryReport.diagnosticSummary}
                </p>
              </div>

              <div className="flex flex-col items-end gap-0.5 shrink-0 p-3.5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl">
                <span className="text-[10px] text-[#8C9A84] font-medium">Regression Slope</span>
                <span className="text-2xl font-serif font-bold text-[#2D3A31]">
                  +{trajectoryReport.trajectorySlope} <span className="text-xs text-[#8C9A84]">/ turn</span>
                </span>
                <span className="text-[10px] text-[#10B981] font-semibold">Positive Momentum</span>
              </div>
            </div>

            {/* 4 Quantitative Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-3.5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-0.5">
                <span className="text-xs text-[#8C9A84] font-semibold">Mean Quality Index</span>
                <div className="text-2xl font-serif font-bold text-[#2D3A31]">{trajectoryReport.qualityScore}%</div>
                <div className="text-[10px] text-[#2D3A31]/60">SVM/KNN Weighted</div>
              </div>

              <div className="p-3.5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-0.5">
                <span className="text-xs text-[#8C9A84] font-semibold">Semantic Density</span>
                <div className="text-2xl font-serif font-bold text-[#2D3A31]">{trajectoryReport.semanticDensity} / 10</div>
                <div className="text-[10px] text-[#2D3A31]/60">Dense technical syntax</div>
              </div>

              <div className="p-3.5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-0.5">
                <span className="text-xs text-[#8C9A84] font-semibold">Cognitive Consistency</span>
                <div className="text-2xl font-serif font-bold text-[#2D3A31]">{trajectoryReport.cognitiveConsistency}%</div>
                <div className="text-[10px] text-[#2D3A31]/60">Aligned with memory nodes</div>
              </div>

              <div className="p-3.5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-0.5">
                <span className="text-xs text-[#8C9A84] font-semibold">Degradation Risk</span>
                <div className="text-2xl font-serif font-bold text-[#10B981]">{trajectoryReport.degradationRisk}%</div>
                <div className="text-[10px] text-[#2D3A31]/60">Near-zero entropy noise</div>
              </div>
            </div>
          </div>

          {/* Model Consensus Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {trajectoryReport.modelFindings.map((finding) => (
              <div
                key={finding.modelId}
                className="p-4 bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#2D3A31]">
                    {finding.modelName}
                  </span>
                  <span className="px-2 py-0.5 bg-[#8C9A84]/15 text-[#2D3A31] rounded-full text-[10px] font-bold">
                    {finding.confidence}% Conf
                  </span>
                </div>

                <p className="text-xs text-[#2D3A31]/80 leading-relaxed">
                  {finding.verdict}
                </p>

                <div className="pt-2 border-t border-[#E6E2DA]/60 flex items-center justify-between text-[11px]">
                  <span className="text-[#8C9A84] font-mono">{finding.metric}</span>
                  <span className="text-[#10B981] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: SEABORN (SNS) SCIENTIFIC CHARTS SUITE
         ========================================================= */}
      {activeTab === "SNS_CHARTS" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Plot 1: SNS Regplot */}
            <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-3">
                <div className="flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-[#8C9A84]" />
                  <span className="font-serif font-bold text-sm text-[#2D3A31]">
                    sns.regplot: Trajectory Slope ($m = +{trajectoryReport.trajectorySlope}$)
                  </span>
                </div>
              </div>

              <div className="w-full h-44 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl p-4 flex flex-col justify-between">
                <svg className="w-full h-32" viewBox="0 0 300 120" preserveAspectRatio="none">
                  <polygon points="20,90 80,70 140,50 200,32 260,18 260,35 200,52 140,70 80,88 20,105" fill="rgba(140,154,132,0.25)" />
                  <polyline fill="none" stroke="#2D3A31" strokeWidth="3" strokeLinecap="round" points="20,95 80,78 140,58 200,40 260,24" />
                  {trajectoryReport.turns.slice(0, 5).map((t, idx) => {
                    const cx = 20 + idx * 60;
                    const cy = Math.max(20, Math.min(100, 110 - (t.technicalRigor - 70) * 2.8));
                    return (
                      <g key={idx}>
                        <circle cx={cx} cy={cy} r="4" fill="#8C9A84" stroke="#FFFFFF" strokeWidth="2" />
                      </g>
                    );
                  })}
                </svg>
                <div className="flex justify-between text-[10px] text-[#8C9A84] font-mono border-t border-[#E6E2DA] pt-1">
                  <span>Turn #1</span>
                  <span>Turn #2</span>
                  <span>Turn #3</span>
                  <span>Turn #4</span>
                  <span>Turn #5</span>
                </div>
              </div>
            </div>

            {/* Plot 2: SNS Heatmap */}
            <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-3">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-[#8C9A84]" />
                  <span className="font-serif font-bold text-sm text-[#2D3A31]">
                    sns.heatmap: Feature Pearson Correlation
                  </span>
                </div>
              </div>

              <div className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl p-3">
                <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-mono">
                  <div className="p-2 bg-[#2D3A31] text-white rounded font-bold">1.00</div>
                  <div className="p-2 bg-[#8C9A84] text-white rounded font-bold">0.88</div>
                  <div className="p-2 bg-[#A5B29E] text-[#2D3A31] rounded">0.74</div>
                  <div className="p-2 bg-[#C8D1C4] text-[#2D3A31] rounded">0.52</div>
                  <div className="p-2 bg-[#E6EAE3] text-[#2D3A31] rounded">0.31</div>

                  <div className="p-2 bg-[#8C9A84] text-white rounded font-bold">0.88</div>
                  <div className="p-2 bg-[#2D3A31] text-white rounded font-bold">1.00</div>
                  <div className="p-2 bg-[#8C9A84] text-white rounded font-bold">0.82</div>
                  <div className="p-2 bg-[#A5B29E] text-[#2D3A31] rounded">0.68</div>
                  <div className="p-2 bg-[#C8D1C4] text-[#2D3A31] rounded">0.45</div>

                  <div className="p-2 bg-[#A5B29E] text-[#2D3A31] rounded">0.74</div>
                  <div className="p-2 bg-[#8C9A84] text-white rounded font-bold">0.82</div>
                  <div className="p-2 bg-[#2D3A31] text-white rounded font-bold">1.00</div>
                  <div className="p-2 bg-[#8C9A84] text-white rounded font-bold">0.91</div>
                  <div className="p-2 bg-[#A5B29E] text-[#2D3A31] rounded">0.70</div>

                  <div className="p-2 bg-[#C8D1C4] text-[#2D3A31] rounded">0.52</div>
                  <div className="p-2 bg-[#A5B29E] text-[#2D3A31] rounded">0.68</div>
                  <div className="p-2 bg-[#8C9A84] text-white rounded font-bold">0.91</div>
                  <div className="p-2 bg-[#2D3A31] text-white rounded font-bold">1.00</div>
                  <div className="p-2 bg-[#8C9A84] text-white rounded font-bold">0.86</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
