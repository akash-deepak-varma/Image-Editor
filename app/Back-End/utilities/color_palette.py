import sys
import json
import cv2
import numpy as np
from sklearn.cluster import KMeans

def extract_color_palette(image, n_colors=5):
    image = cv2.imread(image)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    reshaped = image.reshape((-1, 3))  # Flatten the image to (pixel_count, 3)
    kmeans = KMeans(n_clusters=n_colors, random_state=42).fit(reshaped)
    colors = kmeans.cluster_centers_.astype(int)
    hex_colors = ['#%02x%02x%02x' % tuple(color) for color in colors]
    
    # Ensure output is printed
    print(json.dumps(hex_colors))
    sys.stdout.flush()
    return hex_colors
