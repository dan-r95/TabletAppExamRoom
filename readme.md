# Exam Room Modul Kaffeemaschine

Contains
* Code for the app
* Code for the python programm running on a raspberry pi

The python HTTP server has a configured `HOST` and `PORT`, in the app you have to edit the `serverAdress` variable in `user.service`.

## Quickstart Raspberry Pi
### Zugang 

Anna sollte bereits ihre Wifi Zugangsdaten auf dem Raspberry hinterlegt haben. Daher Mobilen Hotspot auf dem Handy aktivieren und auf dem PC damit verbinden.
Der Raspberry sollte nun auch verbunden sein.
Um das zu ueberpruefen, brauchen wir `nmap`.


Herausfinden der eigenen ip ueber das Terminal und `ifconfig` oder `ipconfig`.
Der Router (Handy) hat dann meist die Endung x.x.x.1 

In `nmap` eingeben: `nmap -sn x.x.x.1/24` und natuerlich das X gegen die eigentliche IP austauschen. Nach einiger Suchzeit muesste auch der Raspberry gefunden sein.

### Zugreifen per ssh

Nun koennen wir ueber `ssh` auf den raspberry zugreifen, da wir seine ip adresse kennen.
Auf Raspberry einloggen: 
`ssh pi@IPadresse  ` 


weitere: Wifi Configurationen schreiben in wpa_config
https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md

**password: examroom** 

Das Projekt befindet sich unter dem Namen `documents/TabletExamRoom`. Der GameManager kann gestartet werden ueber 
`python  ~/documents/TabletExamRoom/raspi/GameManager.py` 

### Grafische Benutzeroberflaeche
Wenn wir auf die GUI des raspberrys gelangen wollen (eigentlich nicht noetig), gelingt das ueber VNC.

Zuerst auf dem raspberry ueber ssh einloggen
`ssh pi@IPadresse` und dann den vnc-server starten ueber `vncserver`.
Nun koennen wir einen VNC client installieren wie:
https://www.realvnc.com/en/connect/download/viewer/

Ueber die oben erlangte IP des raspberrys koennen wir nun die IP im VNC Client eingeben. (port muss nicht mit angegeben werden)

### Probleme?
Sollte das Probleme machen den Pi ins selbe Wifi einzuwaehlen, kann man auch per usb ueber ssh auf den raspberry verbinden und dann die `wpa config` anpassen.
iwi
https://desertbot.io/blog/ssh-into-pi-zero-over-usb


### App anpassen

Nun muessen wir noch in der App die IP Adresse des PCs anpassen, die wir vorhin per `ipconfig` bekommen haben.
Also die Datei `app/services/user.service` anpassen und die variable `this.serverAdress` aendern. 
**Die app muss dann neu gebaut werden!** (Siehe Punkt Getting started - App ).


Weitere Raetsel koennen in der `app/data.ts` eingetragen werden.

## Getting started (App)
It is assumed that you have installed and configured NativeScript properly. If not, head to https://docs.nativescript.org/start/quick-setup and validate its correct functionality.

### Dependencies
**Python is also required running on linux (for the evdev package)**

To start the emulator with this repository:
  > `tns preview`  OR
  > `tns run android` or `tns run ios`
  > `tns build android --bundle` to build APK
  > `tns run android --device Nexus_7_API_27` when using an emulator.

### Development
* Format python code: ```autopep8 --in-place --aggressive --aggressive <filename>```
* This project has been developed with [Visual Studio Code](https://code.visualstudio.com/) and the [NativeScript extension](https://www.nativescript.org/nativescript-for-visual-studio-code).

<div>Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"                 title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
