# See: https://python-evdev.readthedocs.io/en/latest/tutorial.html
import json
from _thread import *
import sys
import socket
from io import BytesIO
from http.server import HTTPServer, BaseHTTPRequestHandler
from select import select
import evdev
from evdev import InputDevice, categorize, ecodes
import glob
from os import listdir
from os.path import isfile, join
import asyncio
import subprocess
from subprocess import PIPE, Popen, call, check_output
import time
from threading import Thread

# Mapping from rfid code to symbol
#            → 		0010086746
# NOT 		0010247315		0010192917
# AND		0010059599		0010179837
# OR		0000110295
# (		0010210257		0000217439
# )		0000105974		0010196425
# Espresso	0010217966
# Latte Ma.	0010203880		0000494987
# Kaffee		0010181421		0010042671
# """


class GameManager:

    def __init__(self):
        # define here an variable for each usb reader we are using
        print("listening over usb...")
        # all connected readers are listed in /dev/input/by-path
        self.idealCombination = None
        self.readCombination = None
        self.selector = None
        self.currentDeviceName = None
        self.devicesMap = None

    @classmethod
    def mapInputToSymbol(self, inp):
        # map input code to symbol
        return codes[inp]

    # Fill devices
    @classmethod
    def getDevices(self, solution, devices):
        # register all found devices

        # find devices we need (keyboard rfid reader) from /dev/input
     
        # add devices here
        self.devices = map(InputDevice, devices)
        self.devicesMap = map(InputDevice, devices)

        self.devices = {dev.fd: dev for dev in self.devices}

        # ATTENTION the index does not start at zero here! - passed key to the list object
        # for i in self.devices:
        #    print(i)

        self.idealCombination = self.initializeSolutionCombination(
            self.devices, solution)
        self.readCombination = self.initializeCombination(self.devices)

    # initialize the correct pairs and to be read pairs
    # TODO: expand with parameters: number of readers and codes which are the
    # solution

    @classmethod
    def initializeSolutionCombination(cls, devices, solution):
        # TODO: pass an object with the solution!
        # init values which are the solution

        # FORMAT
        # id                reader                  solution
        #  3   usb-3f980000.usb-1.2.4/input0        0010210257

        # print(devices.values())

        # the codes to unlock for each reader
        assert len(solution) == len(
            devices), "length must be equal of solution provided and number of devices"

        keys = list(devices.keys())   # to have an index we can read from
        reader = [None] * len(devices)   # fill the reader object
        j = 0
        for i in keys:
            reader[j] = devices[i].path
            j += 1

        idealCombination = {
            "key": keys,
            "deviceName": reader,
            "value": solution  # passed solution dict
        }

        return idealCombination

    @classmethod
    def initializeCombination(cls, devices):
        # these functions give more information about the current device if needed
        # init values in dictionary to be read and filled out
        # print(devices[3].capabilities(verbose = True ))
        # print(devices[3].leds(verbose = True ))
        keys = list(devices.keys())   # to have an index we can read from
        reader = [None] * len(devices)   # fill the reader object
        j = 0
        for i in keys:
            reader[j] = devices[i].path
            j += 1
        # the codes we will read of length of devices
        readValues = [None] * len(devices)

        readCombination = {}

        # fill the dict
        for i in range(len(reader)):
            readCombination[reader[i]] = readValues[i]

        readCombination = {
            "key": keys,
            "deviceName": reader,
            "value": readValues
        }

        return readCombination

    @staticmethod
    # return true if both objects have the same values
    def checkIfOkay(self, ideal, read):
        convertedSymbols = ''
        for item in self.readCombination['value']:
            convertedSymbols += self.mapInputToSymbol(item)
        print(convertedSymbols)
        return convertedSymbols

    # get key where reader name is deviceName by iterating through the
    # device and finding the index
    @staticmethod
    def writeToDictionary(key, value, readCombination):

        j = 0
        for _ in readCombination["deviceName"]:
            if readCombination["deviceName"][j] == key:
                readCombination["value"][j] = value
                break
            else:
                j += 1

    # for every object in the array look if the tag already  exists and if set that value None --> delete
    @classmethod
    def checkIfDuplicateAndIfDelete(self, tag):
        if tag in self.readCombination["value"]:
            j = 0
            for _ in self.readCombination["deviceName"]:
                if self.readCombination["value"][j] == tag:
                    self.readCombination["value"][j] = None
                    break
                else:
                    j += 1

    # if any index in the array is not filled return false, only check with wolfram alpha if all slots are filled
    @classmethod
    def checkIfAllSlotsAreFilled(self):
        for i in self.readCombination["value"]:
            # if any position in the array is none return false
            if i == None:
                return False
        return True

    @classmethod
    def beginReading(self, solution, devices):
        # adapted from http://domoticx.com/nfc-rfid-hardware-usb-stick-syc-idic-usb-reader/
        async def print_events(device):
            container = []
            async for event in device.async_read_loop():
                if event.type == ecodes.EV_KEY and event.value == 1:
                    digit = evdev.ecodes.KEY[event.code]
                    if digit == 'KEY_ENTER':
                        # create and dump the tag
                        tag = "".join(i.strip('KEY_') for i in container)
                        devicePhysName = device.path
                        print(devicePhysName)
                        self.checkIfDuplicateAndIfDelete(tag)
                        self.writeToDictionary(
                            devicePhysName, tag, self.readCombination)
                        # returns true if both data structures have equal values
                        # if all keys are filled
                        if self.checkIfAllSlotsAreFilled():
                            actualSolution = self.checkIfOkay(
                                self, self.idealCombination, self.readCombination)
                            print(actualSolution)

                            result = self.getWolframOutput(solution["param1"], solution["param2"], solution["param3"], solution["param4"],
                                                           solution["param5"], solution["param6"], solution["param7"], actualSolution)

                            # if wolfram alpha equivalent test returns true --> turn on the power
                            result = result.decode('utf-8')
                            print(result)
                            if 'True' in result:
                                # Solution is found - Game over :)
                                print("Steckdose an!!")
                                print("Now lets trigger the power!")
                                self.callPower("00011", "1")
                                # power of coffee machine after some seconds and brewing is over
                                # sleep 2 minutes, 30sec, power off, then exit programm
                                time.sleep(150)
                                self.callPower("00011", "0")
                                exit()
                            elif 'Invalid' in result or 'False' in result:
                                print('not a valid solution :/ try again')
                        container = []
                    else:
                        container.append(digit)

        # grab all devices an read from them indefinetly
        devices = map(InputDevice, devices)
        for device in devices:
            device.grab()  # no more raw_input
            asyncio.ensure_future(print_events(device))

        loop = asyncio.get_event_loop()
        loop.run_forever()
        print(solution)

    # https://mathematica.stackexchange.com/questions/4643/how-to-use-mathematica-functions-in-python-programs
    # hacky way to call wolfram alpha from python
    @classmethod
    def getWolframOutput(cls, element1, element2, element3, element4, element5, element6, element7, solution):
        command = '/usr/local/bin/callWolframAlpha.sh'
        # parameter=expression
        parameters = 'Equivalent['+str(element1)+str(element2)+str(element3)+str(element4) + \
            str(element5)+str(element6)+str(element7) + \
            ','+solution+']//TautologyQ'
        return check_output([command, parameters])
        #proc = subprocess.Popen([command], stdin=PIPE, stdout=PIPE)
        #return call([command, parameter])

    # opens a subprocess which calls the funk module sending data to the power supply
    @classmethod
    def callPower(cls, code, toggle):
        proc = subprocess.Popen(["/home/pi/raspberry-remote/send",
                                 code,
                                 "4",
                                 toggle, ], stdin=PIPE, stdout=PIPE)


'''
	Simple socket server using threads
'''
class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    # should use this to reset server
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        # exit(0)
        
    #def sendToClient(self, message):
     #       
        #self.send_content('192.168.
       # httpd

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        # decode byte to string
        json = body.decode('utf8').replace("'", '"')
        response = BytesIO()
        self.wfile.write(response.getvalue())
        self.send_response(200)
        self.end_headers()
        self.handleJson(json)
        #thread = Thread(target = self.handleJson, args = (json ))
        # thread.start()
        # thread.join()
        #print("thread finished...exiting")

    def handleJson(self, body):
        # MAIN LOOP
        print(body)
        params = json.loads(body)
        assert len(params) == 7, 'json body should have 7 parameters'

        # UPDATE the SOLUTION we need!
        g = GameManager()
        g.callPower("00011", "0")
        # fill our solution here
        solution = ["0000405226", "0010247315", "0010210257",
                    "0010086746", "0010203880", "0010181421", "0010217966"]
        devices = ['/dev/input/by-path/platform-3f980000.usb-usb-0:1.2:1.0-event-kbd',
                '/dev/input/by-path/platform-3f980000.usb-usb-0:1.1.3:1.0-event-kbd',
                '/dev/input/by-path/platform-3f980000.usb-usb-0:1.3:1.0-event-kbd',
                '/dev/input/by-path/platform-3f980000.usb-usb-0:1.1.2.1:1.0-event-kbd',
                '/dev/input/by-path/platform-3f980000.usb-usb-0:1.1.2.2:1.0-event-kbd',
                '/dev/input/by-path/platform-3f980000.usb-usb-0:1.1.2.3:1.0-event-kbd',
                '/dev/input/by-path/platform-3f980000.usb-usb-0:1.1.2.4:1.0-event-kbd',
                ]
        g.getDevices(solution, devices)
        # loop until input
        g.beginReading(params, devices)


# SERVER MAIN
# global codes
codes = {
    '0010086746': 'IMPLIES',
    '0010247315': 'NOT',
    '0010192917': 'NOT',
    '0010059599': '&&',
    '0010179837': '&&',
    '0000110295': '||',
    '0010210257': '(',
    '0000217439': '(',
    '0000105974': ')',
    '0010196425': ')',
    '0010217966': 'E',
    '0010203880': 'L',
    '0000494987': 'L',
    '0010181421': 'K',
    '0010042671': 'K'
}

print(codes)
print(codes['0010059599'])


HOST = '192.168.43.9'  # Symbolic name, meaning all available interfaces
PORT = 8888  # Arbitrary non-privileged port
# Run the whole program
httpd = HTTPServer((HOST, PORT), SimpleHTTPRequestHandler)
print("listening on " + str(HOST) + " port: " + str(PORT) + "...")
httpd.serve_forever()
