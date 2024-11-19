import paho.mqtt.client as mqtt
import json
import time
import random
import os

# MQTT settings
broker = "mosquitto"
port = 1883
topic = "sensor/data"


# Data simulation function
def simulate_data():
    return {
        "timestamp": int(time.time()),
        "avg_inflow": random.uniform(50, 100),
        "avg_outflow": random.uniform(50, 100),
        "pressure": random.uniform(1, 10),
        "flow_rate": random.uniform(10, 20),
        "vibration": random.uniform(0, 1),
        "temperature": random.uniform(-20, 50),
        "humidity": random.uniform(0, 100),
        "precipitation": random.uniform(0, 100),
    }


# Connect to the MQTT broker
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe(topic)


client = mqtt.Client()
client.on_connect = on_connect

client.connect(broker, port, 60)

client.loop_start()

sensors = int(os.getenv("SENSORS", 3))
wait_time = int(os.getenv("WAIT_TIME", 5))

sensor_ids = range(1, sensors + 1)

try:
    while True:
        all_sensor_data = {}
        for sensor_id in sensor_ids:
            all_sensor_data[sensor_id] = simulate_data()

        payload = json.dumps(all_sensor_data)

        client.publish(topic, payload)

        time.sleep(wait_time)
except KeyboardInterrupt:
    print("Simulation stopped.")
    client.loop_stop()
