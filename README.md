# ESIT-Final-Project

Monitoraggio del distanziamento sociale

Implementazione di un sistema IoT per il monitoraggio del distanziamento sociale mediante
l’indice RSSI.

Il progetto prevede la realizzazione di un sistema scalabile composto da: 

	1) webapp comprensiva di
	   backend per la gestione dei dati dei dispositivi e frontend che funge da pannello di amministrazione; 

	2) due dispositivi che rappresentano due soggetti.

Il monitoraggio della distanza deve avvenire tramite rilevazioni RSSI.

Le rilevazioni della distanza vengono salvate in un database remoto e gestite secondo il paradigma
Shadow Things.

Il valore di RSSI deve essere convertito in cm e, in base alla distanza ottenuta,associato a uno dei
  seguenti stati:

○ sicuro (>10 m)
○ livello di rischio basso (<= 10 m && >= 3m)
○ livello di rischio medio (>= 1m && < 3m)
○ livello di rischio alto (<1 m)

L’interfaccia web di amministrazione permetterà: 

	1) la visualizzazione delle rilevazioni in tempo reale; 

	2) la modifica delle soglie di distanza associate a ogni stato; 

	3) la modifica del protocollo di comunicazione usato per rilevare il valore di RSSI 
	   (ovvero la scelta tra WiFi e BLE).


Il sistema dovrà opportunamente segnalare ai due utenti a rischio quando lo stato del sistema segnala un
pericolo almeno di livello medio.

Verificare quali sono le condizioni nelle quali si ottengono i risultati più precisi (BLE VS WiFi, distanze brevi
VS lunghe, …)