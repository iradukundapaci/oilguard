# Use Python 3.9 as the base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the Python script into the container
COPY mqtt_simulator.py /app/mqtt_simulator.py

# Install required Python packages
RUN pip install paho-mqtt

# Command to run the Python script
CMD ["python", "mqtt_simulator.py"]
