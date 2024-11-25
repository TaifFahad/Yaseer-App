import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics import pairwise_distances
from geopy.distance import geodesic
import folium
from folium.plugins import MarkerCluster

# Initialize Firebase Admin SDK with JSON file
cred = credentials.Certificate("C:\\Users\\96650\\Downloads\\yaseer-cdb7f-firebase-adminsdk-s71u4-5de644336e.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Fetch student data from Firestore
print("Fetching data from Firestore...")
students_ref = db.collection("cluster")
students_docs = students_ref.stream()

# Convert fetched data to DataFrame
students_data = []
for doc in students_docs:
    doc_data = doc.to_dict()
    students_data.append({
        'id': doc.id,
        'student_name': doc_data['name'],
        'latitude': float(doc_data['lat']),
        'longitude': float(doc_data['lng'])
    })
data_frame = pd.DataFrame(students_data)
print("Data fetched successfully!")

# Define students per cluster and calculate the number of clusters
students_per_cluster = 4
n_clusters = max(1, len(data_frame) // students_per_cluster)

# Calculate the pairwise distance matrix using geodesic distance
print("Calculating distances for Agglomerative Clustering...")
distance_matrix = pairwise_distances(
    data_frame[['latitude', 'longitude']],
    metric=lambda x, y: geodesic((x[0], x[1]), (y[0], y[1])).meters
)

# Apply Agglomerative Clustering using precomputed distances
clustering = AgglomerativeClustering(
    n_clusters=n_clusters, metric="precomputed", linkage="complete"
)
labels = clustering.fit_predict(distance_matrix)
data_frame['Cluster'] = labels
print("Clustering complete with Agglomerative Clustering.")

# Create clusters based on the Agglomerative Clustering labels
clusters = {i: [] for i in range(n_clusters)}
for _, row in data_frame.iterrows():
    clusters[row['Cluster']].append(row)

# Reassign excess students to ensure balanced clusters
print("Balancing clusters to maintain 4 students per cluster...")
centroids = data_frame.groupby('Cluster')[['latitude', 'longitude']].mean().values

for cluster_id, students in list(clusters.items()):
    while len(students) > students_per_cluster:
        # Remove excess student and reassign based on proximity
        student = students.pop()
        student_location = (student['latitude'], student['longitude'])
        
        # Find the nearest cluster with available space
        nearest_cluster = None
        min_distance = float('inf')
        for other_cluster_id, other_centroid in enumerate(centroids):
            if len(clusters[other_cluster_id]) < students_per_cluster:
                other_centroid_location = (other_centroid[0], other_centroid[1])
                distance = geodesic(student_location, other_centroid_location).meters
                if distance < min_distance:
                    min_distance = distance
                    nearest_cluster = other_cluster_id
        
        # Add student to the nearest available cluster
        if nearest_cluster is not None:
            clusters[nearest_cluster].append(student)

# Update Firestore with final clustering results
print("Updating Firestore with final clusters...")
for cluster_id, students in clusters.items():
    for student in students:
        doc_ref = db.collection("cluster").document(student['id'])
        doc_ref.update({
            'Final_Cluster': f"Cluster {cluster_id + 1}"
        })

# Prepare data for visualization in Folium
print("Creating map...")
final_data = []
for cluster_id, students in clusters.items():
    for student in students:
        final_data.append({
            'id': student['id'],
            'student_name': student['student_name'],
            'latitude': student['latitude'],
            'longitude': student['longitude'],
            'Final_Cluster': f"Cluster {cluster_id + 1}"
        })
final_data_frame = pd.DataFrame(final_data)

# Generate Folium map with clusters
map_center = [final_data_frame['latitude'].mean(), final_data_frame['longitude'].mean()]
folium_map = folium.Map(location=map_center, zoom_start=12)
colors = ["red", "blue", "green", "purple", "orange"]

for cluster_label in final_data_frame['Final_Cluster'].unique():
    cluster_data = final_data_frame[final_data_frame['Final_Cluster'] == cluster_label]
    cluster_color = colors[int(cluster_label.split()[-1]) % len(colors)]
    marker_cluster = MarkerCluster(name=cluster_label)
    for _, row in cluster_data.iterrows():
        folium.Marker(
            location=[row['latitude'], row['longitude']],
            popup=f"{row['student_name']} - {cluster_label}",
            icon=folium.Icon(color=cluster_color)
        ).add_to(marker_cluster)
    folium_map.add_child(marker_cluster)

folium.LayerControl().add_to(folium_map)
print("Saving map to 'student_clusters_map.html'...")
folium_map.save("student_clusters_map.html")
print("Firestore updated and map created successfully.")
