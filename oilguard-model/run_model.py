import json
import joblib
import paho.mqtt.client as mqtt
import numpy as np
import pandas as pd  # Import pandas to create DataFrame for scaling
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load the pre-trained model and scaler
try:
    lof_model = joblib.load("pipeline_anomaly_lof_model.pkl")
    scaler = joblib.load("pipeline_data_scaler_lof.pkl")
    logger.info("Model and scaler loaded successfully.")
except Exception as e:
    logger.error(f"Error loading model or scaler: {e}")
    exit(1)

# MQTT configuration
BROKER = "mosquitto"
PORT = 1883
SENSOR_DATA_TOPIC = "sensor/data"
PREDICTION_TOPIC = "sensor/predictions"

# Define the features used in the model
FEATURES = [
    "avg_inflow",
    "avg_outflow",
    "pressure",
    "flow_rate",
    "vibration",
    "temperature",
    "humidity",
    "precipitation",
]

# Callback for when the client connects to the broker
def on_connect(client, userdata, flags, rc):
    logger.info(f"Connected to MQTT broker with result code {rc}")
    client.subscribe(SENSOR_DATA_TOPIC)

# Callback for when a message is received
def on_message(client, userdata, msg):
    logger.info(f"Received message on {msg.topic}")
    try:
        # Parse the incoming JSON payload
        payload = json.loads(msg.payload.decode())

        predictions = {}

        for sensor_id, sensor_data in payload.items():
            try:
                # Extract features and scale the data
                feature_values = np.array(
                    [sensor_data[feature] for feature in FEATURES]
                ).reshape(1, -1)

                # Convert the feature values to a DataFrame with the correct feature names
                feature_values_df = pd.DataFrame(feature_values, columns=FEATURES)

                # Scale the data using the scaler
                scaled_features = scaler.transform(feature_values_df)

                # Make predictions
                anomaly = lof_model.predict(scaled_features)[0] == -1  # True if anomaly

                # Store results for the sensor
                predictions[sensor_id] = {
                    "anomaly": bool(anomaly),  # Convert to Python boolean
                    "timestamp": sensor_data["timestamp"],
                }

                logger.info(f"Prediction for sensor {sensor_id}: Anomaly - {anomaly}")

            except Exception as e:
                logger.error(f"Error processing sensor data for {sensor_id}: {e}")
                continue  # Skip to the next sensor if there was an error

        # Publish predictions to another MQTT topic
        client.publish(PREDICTION_TOPIC, json.dumps(predictions))
        logger.info(f"Published predictions to {PREDICTION_TOPIC}: {predictions}")

    except Exception as e:
        logger.error(f"Error processing message: {e}")

# Initialize MQTT client
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Connect to the broker and start listening
try:
    client.connect(BROKER, PORT, 60)
    logger.info(f"Attempting to connect to MQTT broker at {BROKER}:{PORT}...")
    client.loop_forever()
except Exception as e:
    logger.error(f"Error connecting to MQTT broker: {e}")
    exit(1)
