# Use Python 3.9 as the base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the necessary files into the container
COPY run_model.py /app/run_model.py
COPY pipeline_anomaly_lof_model.pkl /app/pipeline_anomaly_lof_model.pkl
COPY pipeline_data_scaler_lof.pkl /app/pipeline_data_scaler_lof.pkl

# Install required Python packages
RUN pip install --no-cache-dir joblib paho-mqtt numpy pandas scikit-learn

# Command to run the Python script
CMD ["python", "run_model.py"]
