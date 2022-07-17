#include "secrets.h"
#include <WiFiClientSecure.h>
#include <MQTTClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"
#include "time.h"

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>

// The MQTT topics that this device should publish/subscribe
#define AWS_IOT_PUBLISH_TOPIC   "esp32/pub"
#define AWS_IOT_SUBSCRIBE_TOPIC "esp32/sub"

const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 0;
const int   daylightOffset_sec = 3600;

int scanTime = 5; //In seconds
BLEScan* pBLEScan;
float distance;
String device_name;
int count = 0;
String nome_rete;
String distanza_rete;
String scelta = "ble";

class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice advertisedDevice) {
      device_name = advertisedDevice.getName().c_str();
      if (device_name == "")
        device_name = "Dispositivo sconosciuto";
      //int8_t device_pow = advertisedDevice.getTXPower();
      Serial.print(F("Advertised Device: "));
      Serial.println(device_name);
      distance = pow(10, ((-72.0 - advertisedDevice.getRSSI()) / 20.0));
      Serial.printf("Distance: %.2f m\n", distance);
    }
};

WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(256);

void connectAWS()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }

  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.begin(AWS_IOT_ENDPOINT, 8883, net);

  // Create a message handler
  client.onMessage(messageHandler);

  Serial.print("Connecting to AWS IOT");

  while (!client.connect(THINGNAME)) {
    Serial.print(".");
    delay(100);
  }

  if(!client.connected()){
    Serial.println("AWS IoT Timeout!");
    return;
  }

  // Subscribe to a topic
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);

  Serial.println("AWS IoT Connected!");
}

//funzione che restituisce un timestamp univoco per creare un ID per il messaggio MQTT
String printLocalTime(){
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return "Failed";
  }

  char timeHour[3];
  strftime(timeHour,3, "%H", &timeinfo);
  String timeHourString(timeHour);
  
  char timeYear[5];
  strftime(timeYear,5, "%Y", &timeinfo);
  String timeYearString(timeYear);

  char timeMonth[10];
  strftime(timeMonth,10, "%B", &timeinfo);
  String timeMonthString(timeMonth);

  char timeDay[3];
  strftime(timeDay,3, "%d", &timeinfo);
  String timeDayString(timeDay);

   char timeMinute[3];
  strftime(timeMinute,3, "%M", &timeinfo);
  String timeMinuteString(timeMinute);

  char timeSecond[3];
  strftime(timeSecond,3, "%S", &timeinfo);
  String timeMinuteSecond(timeSecond);

  
  String timeStamp = timeYearString + timeMonthString + timeDayString +timeHourString + timeMinuteString + timeMinuteSecond;

  return timeStamp;
}


void publishMessage()
{ 
  String timeStamp = printLocalTime();
  StaticJsonDocument<200> doc;
  doc["deviceId"] = timeStamp; 
  doc["device"] = device_name;
  doc["distance"] = distance;
  doc["protocollo"] = "BLE";
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer); // print to client

  client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
}

void publishMessageWifi()
{
  StaticJsonDocument<200> doc;
  doc["deviceId"] = timeStamp; 
  doc["device"] = nome_rete;
  doc["distance"] = distanza_rete;
  doc["protocollo"] = "Wifi";
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer); // print to client

  client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
}

void messageHandler(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);

//  StaticJsonDocument<200> doc;
//  deserializeJson(doc, payload);
//  const char* message = doc["message"];
}

void setup() {
  Serial.begin(9600);
  connectAWS();

  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan(); //create new scan
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true); //active scan uses more power, but get results faster
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);  // less or equal setInterval value

  // Init and get the time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();
  
}

void BLEScan(){
  
  BLEScanResults foundDevices = pBLEScan->start(scanTime, false); 
  publishMessage();
  Serial.print("Devices found: ");
  Serial.println(foundDevices.getCount());
  Serial.println("Scan done!"); 
  client.loop();
  //pBLEScan->clearResults();   // delete results fromBLEScan buffer to release memory
  delay(5000);
  
  }

void WifiScan(){
  
  Serial.println("scan start");

    // WiFi.scanNetworks will return the number of networks found
    int n = WiFi.scanNetworks();
    Serial.println("scan done");
    if (n == 0) {
        Serial.println("no networks found");
    } else {
        Serial.print(n);
        Serial.println(" networks found");
        for (int i = 0; i < n; ++i) {
            // Print SSID and RSSI for each network found
            Serial.print(i + 1);
            Serial.print(": ");
            nome_rete = WiFi.SSID(i);
            distanza_rete = pow(10, ((-72.0 - WiFi.RSSI(i)) / 20.0));
            Serial.print(WiFi.SSID(i));
            Serial.print(" (");
            Serial.print(WiFi.RSSI(i));
            Serial.print(")");
            Serial.println((WiFi.encryptionType(i) == WIFI_AUTH_OPEN)?" ":"*");
            delay(10);
            publishMessageWifi();
        }
    }
    Serial.println("");

    // Wait a bit before scanning again
    delay(5000);
  
  }

void loop() {

  if (scelta == "ble")
    BLEScan();
    
  if (scelta == "wifi")
    WifiScan();
  
}
