import sys
import cv2
import numpy as np
from sklearn.cluster import KMeans
from utilities.color_palette import extract_color_palette


'''
# Function to remove background
def remove_bg(input_path, output_path):
    with open(input_path, 'rb') as input_file:
        input_data = input_file.read()
    output_data = remove(input_data)
    with open(output_path, 'wb') as output_file:
        output_file.write(output_data)

# Function to enhance image resolution (dummy example)
def enhance_resolution(input_path, output_path):
    image = Image.open(input_path)
    enhanced_image = image.resize((image.width * 2, image.height * 2), Image.LANCZOS)
    enhanced_image.save(output_path)

# Function to apply a filter (dummy example)
def apply_filter(input_path, output_path):
    image = Image.open(input_path)
    enhancer = ImageEnhance.Color(image)
    enhanced_image = enhancer.enhance(1.5)  # Increase color saturation
    enhanced_image.save(output_path)
'''

# Map function names to actual functions
def execute_function(function_name, input_path, output_path):
    if function_name == 'extract_color_palette':
        extract_color_palette(input_path, n_colors=5)
    elif function_name == 'enhance_resolution':
      #  enhance_resolution(input_path, output_path)
      pass
    elif function_name == 'apply_filter':
       # apply_filter(input_path, output_path)
       pass
    else:
        print(f"Function {function_name} not recognized.")
        sys.exit(1)

if __name__ == "__main__":
    function_name = sys.argv[1]  # Function name to execute
    input_path = sys.argv[2]     # Input file path
    output_path = sys.argv[3]    # Output file path
    execute_function(function_name, input_path, output_path)
