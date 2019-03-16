#include <WiFi.h>
#include <ESPmDNS.h>
#include "aWOT.h"
#include "env.h"

WiFiServer server(80);
WebApp app;

String sendCommand(String command, boolean retry) {
  String ack;

  Serial.println("Sending command");

  Serial2.print(command);
  ack = Serial2.readStringUntil('\r');

  // retry once
  if (ack.length() == 0 && retry == true) {
    return sendCommand(command, false);
  }

  return ack;
}

void handleCommandRequest(Request &req, Response &res) {
  String command, ack;

  while (req.available()) {
    char ch = req.read();
    command += ch;
  }
  ack = sendCommand(command, true);

  if (ack.length() == 0) {
    res.fail();
    return;
  }

  res.success("text/plain");
  res.print(ack);
}

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(WiFi.localIP());

  if (!MDNS.begin("lg-controller")) {
    Serial.println("Error setting up MDNS responder!");
  }
  MDNS.addService("http", "tcp", 80);

  app.post("/command", &handleCommandRequest);
  app.use(staticFiles());

  server.begin();
}

void loop() {
  WiFiClient client = server.available();

  if (client.connected()) {
    app.process(&client);
  }
}
