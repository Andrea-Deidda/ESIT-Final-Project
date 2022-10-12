#include "secrets.h"
#include <WiFiClientSecure.h>
#include <MQTTClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"
#include "time.h"
#include <LiquidCrystal_I2C.h>

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>

// The MQTT topics that this device should publish/subscribe
#define AWS_IOT_PUBLISH_TOPIC   "esp32/pub"
#define AWS_IOT_SUBSCRIBE_TOPIC "esp32/sub"

#define AWS_IOT_PUBLISH_SHADOW_TOPIC "$aws/things/esit-obj1/shadow/update"
#define AWS_IOT_SUBSCRIBE_SHADOW_TOPIC "$aws/things/esit-obj1/shadow/update/delta"

const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 0;
const int   daylightOffset_sec = 3600;

// set the LCD number of columns and rows
int lcdColumns = 16;
int lcdRows = 2;

void publishMessage();

// set LCD address, number of columns and rows
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows); // 0x27 è stato preso con I2C scanner

const int LED1 = 5;
const int buzzer = 23;

String sndPayloadWIFI = "{\"state\": { \"reported\": { \"protocollo\": \"wifi-10-3-10-1-3-1\" } }}";
String sndPayloadBLE = "{\"state\": { \"reported\": { \"protocollo\": \"ble-10-3-10-1-3-1\" } }}";

int scanTime = 5; //In seconds
BLEScan* pBLEScan;
float distance;
String device_name;
int count = 0;
String nome_rete;
float distanza_rete;
String address_ble;
String address_wifi;
String dati = "";
String scelta = "ble";
String rcvdPayload;
bool msgReceived = false;

String inputSafeRiskThreshold;
String inputLowRiskThresholdMin;
String inputLowRiskThresholdMax;
String inputMediumRiskThresholdMin;
String inputMediumRiskThresholdMax;
String inputHighRiskThreshold;
String liv_rischio = "";

String livelloRischio(float misura);

class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice advertisedDevice) {
      device_name = advertisedDevice.getName().c_str();
      address_ble = advertisedDevice.getAddress().toString().c_str();
      if (device_name == "")
        device_name = "UNKNOWN";

      distance = pow(10, ((-55.0 - advertisedDevice.getRSSI()) / 20.0));
      liv_rischio = livelloRischio(distance);

      Serial.print(F("Device: "));
      Serial.print(device_name);
      Serial.printf(" distanza: %.2f m: %s\n", distance, liv_rischio);

      publishMessage();
      
      if (device_name == "HONOR Band 5-412") {
        lcd.setCursor(0, 0);
        lcd.print(liv_rischio);
        lcd.setCursor(0, 1);
        lcd.print(device_name);
        if (liv_rischio == "RISCHIO MEDIO") {
          digitalWrite(buzzer, HIGH);
          delay(1000);
          digitalWrite(buzzer, LOW);
          delay(1000);
          digitalWrite(buzzer, HIGH);
          delay(1000);
          digitalWrite(buzzer, LOW);
          delay(1000);
          digitalWrite(buzzer, HIGH);
          delay(1000);
          digitalWrite(buzzer, LOW);
          delay(1000);
        } else {
          if(liv_rischio == "RISCHIO ALTO") 
            digitalWrite(buzzer, HIGH);        
            else
            digitalWrite(buzzer, LOW); 
        }
      }
    }
};

WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(256);

void connectAWS()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED) {
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
    digitalWrite(LED1, LOW);
    Serial.print(".");
    delay(100);
  }

  if (!client.connected()) {
    digitalWrite(LED1, LOW);
    Serial.println("AWS IoT Timeout!");
    return;
  }

  // Subscribe to a topic
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
  client.subscribe(AWS_IOT_SUBSCRIBE_SHADOW_TOPIC);

  Serial.println("AWS IoT Connected!");
  digitalWrite(LED1, HIGH);
}

//funzione che restituisce un timestamp univoco per creare un ID per il messaggio MQTT
String printLocalTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return "Failed";
  }

  char timeHour[3];
  strftime(timeHour, 3, "%H", &timeinfo);
  String timeHourString(timeHour);

  char timeYear[5];
  strftime(timeYear, 5, "%Y", &timeinfo);
  String timeYearString(timeYear);

  char timeMonth[10];
  strftime(timeMonth, 10, "%m", &timeinfo);
  String timeMonthString(timeMonth);

  char timeDay[3];
  strftime(timeDay, 3, "%d", &timeinfo);
  String timeDayString(timeDay);

  char timeMinute[3];
  strftime(timeMinute, 3, "%M", &timeinfo);
  String timeMinuteString(timeMinute);

  char timeSecond[3];
  strftime(timeSecond, 3, "%S", &timeinfo);
  String timeMinuteSecond(timeSecond);


  String timeStamp = timeYearString + "-" + timeMonthString + "-" + timeDayString + "-" + timeHourString + ":" + timeMinuteString + ":" + timeMinuteSecond;

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
  doc["address"] = address_ble;
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer); // print to client

  client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
  delay(1000);
}

void publishMessageWifi()
{
  String timeStamp = printLocalTime();
  StaticJsonDocument<200> doc;
  doc["deviceId"] = timeStamp;
  doc["device"] = nome_rete;
  doc["distance"] = distanza_rete;
  doc["protocollo"] = "WIFI";
  doc["address"] = address_wifi;
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer); // print to client

  client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
  delay(1000);

}

void messageHandler(String &topic, String &payload) {
  msgReceived = true;
  rcvdPayload = payload;
}

void setup() {

  pinMode(LED1, OUTPUT);
  pinMode(buzzer, OUTPUT);

  // initialize LCD
  lcd.init();
  // turn on LCD backlight                      
  lcd.backlight();
  
  Serial.begin(115200);
  connectAWS();

  inputSafeRiskThreshold = "10";
  inputLowRiskThresholdMin = "3";
  inputLowRiskThresholdMax = "10";
  inputMediumRiskThresholdMin = "1";
  inputMediumRiskThresholdMax = "3";
  inputHighRiskThreshold = "1";

  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan(); //create new scan
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true); //active scan uses more power, but get results faster
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);  // less or equal setInterval value

  // Init and get the time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();

  client.publish(AWS_IOT_PUBLISH_SHADOW_TOPIC, sndPayloadBLE);

}

void BLEScan() {

  Serial.println("BLE SCAN: ");
  BLEScanResults foundDevices = pBLEScan->start(scanTime, false);
  //publishMessage();
  Serial.print("Devices found: ");
  Serial.println(foundDevices.getCount());
  Serial.println("Scan done!");
  Serial.println("");
  client.loop();
  //pBLEScan->clearResults();   // delete results fromBLEScan buffer to release memory
  delay(5000);
  lcd.clear();

}

void WifiScan() {

  Serial.println("WIFI SCAN: ");

  // WiFi.scanNetworks will return the number of networks found
  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  if (n == 0) {
    Serial.println("no networks found");
  } else {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i) {

      Serial.print(i + 1);
      Serial.print(": ");
      nome_rete = WiFi.SSID(i);
      distanza_rete = pow(10, ((-55.0 - WiFi.RSSI(i)) / 20.0));
      address_wifi = WiFi.macAddress();

      liv_rischio = livelloRischio(distanza_rete);

      Serial.print(WiFi.SSID(i));
      Serial.printf(" distanza: %.2f m: %s\n", distanza_rete, liv_rischio);
      delay(10);
      publishMessageWifi();

      if (nome_rete == "Galaxy A512646") {
        lcd.setCursor(0, 0);
        lcd.print(liv_rischio);
        lcd.setCursor(0, 1);
        lcd.print(nome_rete);
        if (liv_rischio == "RISCHIO MEDIO") {
          digitalWrite(buzzer, HIGH);
          delay(1000);
          digitalWrite(buzzer, LOW);
          delay(1000);
          digitalWrite(buzzer, HIGH);
          delay(1000);
          digitalWrite(buzzer, LOW);
          delay(1000);
          digitalWrite(buzzer, HIGH);
          delay(1000);
          digitalWrite(buzzer, LOW);
          delay(1000);
        } else {
          if(liv_rischio == "RISCHIO ALTO") 
            digitalWrite(buzzer, HIGH);        
            else
            digitalWrite(buzzer, LOW); 
        }
      }
    }
  }
  Serial.println("");

  // Wait a bit before scanning again
  delay(5000);
  lcd.clear();
}

String livelloRischio(float misura) {
  String rischio = "";

  if (misura > inputSafeRiskThreshold.toFloat())
    rischio = "SICURO";
  else if (misura >= inputLowRiskThresholdMin.toFloat() && misura <= inputLowRiskThresholdMax.toFloat())
    rischio = "RISCHIO BASSO";
  else if (misura >= inputMediumRiskThresholdMin.toFloat() && misura < inputMediumRiskThresholdMax.toFloat())
    rischio = "RISCHIO MEDIO";
  else
    rischio = "RISCHIO ALTO";

  return rischio;
}

void loop() {

  if (msgReceived) {
    delay(100);
    msgReceived = false;
    Serial.print("Received Message:");
    Serial.println(rcvdPayload);
    Serial.println("");

    StaticJsonDocument<200> doc;
    deserializeJson(doc, rcvdPayload);
    const char *message = doc["state"]["protocollo"];
    dati = String(message);

    int str_len = dati.length() + 1;
    char char_array[str_len];
    dati.toCharArray(char_array, str_len);

    scelta = strtok(char_array, "-");
    inputSafeRiskThreshold = strtok(NULL, "-");
    inputLowRiskThresholdMin = strtok(NULL, "-");
    inputLowRiskThresholdMax = strtok(NULL, "-");
    inputMediumRiskThresholdMin = strtok(NULL, "-");
    inputMediumRiskThresholdMax = strtok(NULL, "-");
    inputHighRiskThreshold = strtok(NULL, "-");

    String payloadBLE = "{\"state\": { \"reported\": { \"protocollo\": \"ble-" + inputSafeRiskThreshold + "-" + inputLowRiskThresholdMin + "-" + inputLowRiskThresholdMax + "-" + inputMediumRiskThresholdMin + "-" + inputMediumRiskThresholdMax + "-" + inputHighRiskThreshold +"\" } }}";
    String payloadWIFI = "{\"state\": { \"reported\": { \"protocollo\": \"wifi-" + inputSafeRiskThreshold + "-" + inputLowRiskThresholdMin + "-" + inputLowRiskThresholdMax + "-" + inputMediumRiskThresholdMin + "-" + inputMediumRiskThresholdMax + "-" + inputHighRiskThreshold +"\" } }}";
    Serial.println(payloadBLE);
    Serial.println(payloadWIFI);
    
    if (scelta == "ble") {
      Serial.println("Turning BLE");
      client.publish(AWS_IOT_PUBLISH_SHADOW_TOPIC, payloadBLE);
    }

    if (scelta == "wifi")
    {
      Serial.println("Turning WIFI");
      client.publish(AWS_IOT_PUBLISH_SHADOW_TOPIC, payloadWIFI);

    }
  }

  //Serial.println(msgReceived);
  if (scelta == "ble")
    BLEScan();


  if (scelta == "wifi")
    WifiScan();

  client.loop();
}
