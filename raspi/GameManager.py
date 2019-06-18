# See: https://python-evdev.readthedocs.io/en/latest/tutorial.html
import evdev
from select import select
from evdev import InputDevice, categorize, ecodes
import glob
from os import listdir
from os.path import isfile, join
import asyncio
import subprocess
from subprocess import PIPE, Popen


class GameManager:

    def __init__(self):
        # define here an variable for each usb reader we are using
        print("listening over usb...")
        # all connected readers are listed in /dev/input/by-path
        self.idealCombination = None
        self.readCombination = None
        self.selector = None
        self.currentDeviceName = None

    # Fill devices
    @classmethod
    def getDevices(self, solution):
        # register all found devices
        devices = glob.glob("/dev/input/by-path/*")
        self.devicesMatching = []

        # find devices we need (keyboard rfid reader) from /dev/input
        for device in devices:
            if 'usb' in device and 'event-kbd' in device:
                self.devicesMatching.append(device)

        # add devices here
        # TODO: handle expection when none are found
        self.devices = map(InputDevice, self.devicesMatching)
        self.devicesMap = map(InputDevice, self.devicesMatching)
        # for i in self.devices:
        #    i.grab()

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
        len(solution)
        # len(devices)
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
        print("ideal: ")
        print(ideal["key"])
        print(ideal["value"])
        print("read: ")
        print(read["key"])
        print(read["value"])
        for key, _ in self.idealCombination.items():
            if self.idealCombination[key] != self.readCombination[key]:
                return False
        return True

    @staticmethod
    def writeToDictionary(key, value, readCombination):
        # get key where reader name is deviceName by iterating through the
        # device and finding the index
        j = 0
        for _ in readCombination["deviceName"]:
            if readCombination["deviceName"][j] == key:
                readCombination["value"][j] = value
                break
            else:
                j += 1
                
    @classmethod
    def checkIfDuplicateAndIfDelete(self, tag):
        print("§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§")
        print(tag)
        print(self.readCombination)
        print("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")
        print(self.readCombination["value"])
        if tag in self.readCombination["value"]:
            j = 0
            for _ in self.readCombination["deviceName"]:
                print("for schleife")
                if self.readCombination["value"][j] == tag:
                    self.readCombination["value"][j] = None
                    print(self.readCombination["value"][j])
                    break
                else:
                    j += 1
                    print("j plus 1")
        else: print("not in")
                    

    @classmethod
    def beginReading(self):
        # adapted from
        # http://domoticx.com/nfc-rfid-hardware-usb-stick-syc-idic-usb-reader/

        # print(self.devices)

        async def print_events(device):
            container = []
            async for event in device.async_read_loop():
                if event.type == ecodes.EV_KEY and event.value == 1:
                    digit = evdev.ecodes.KEY[event.code]
                    if digit == 'KEY_ENTER':
                        # create and dump the tag
                        tag = "".join(i.strip('KEY_') for i in container)
                        devicePhysName = device.path
                        self.checkIfDuplicateAndIfDelete(tag)
                        self.writeToDictionary(
                            devicePhysName, tag, self.readCombination)
                        # returns true if both data structures have equal
                        # values
                        result = self.checkIfOkay(
                            self, self.idealCombination, self.readCombination)
                        if result:
                            # Solution is found - Game over :)
                            print("Steckdose an!!")
                            print("Now lets trigger the power!")
                            self.callPower("00011", "1")
                            break
                        container = []
                    else:
                        container.append(digit)

        for device in self.devicesMap:
            device.grab()  # no more raw_input
            asyncio.ensure_future(print_events(device))

        loop = asyncio.get_event_loop()
        loop.run_forever()

    # follow other steps:
    # https://mathematica.stackexchange.com/questions/4643/how-to-use-mathematica-functions-in-python-programs
    # hacky way to call wolfram alpha from python
    @classmethod
    def getWolframOutput(cls, expression):
        #!/usr/bin/python
        command = '/usr/local/bin/runMath'
        parameter = expression
        call([command, parameter])
        
    @classmethod    
    def callPower(cls, code, toggle):
        #spawn darknet process
        proc = subprocess.Popen(["/home/pi/raspberry-remote/send",
                   code,
                   "4",
                   toggle,], stdin = PIPE, stdout = PIPE)


# UPDATE the SOLUTION we need!
#
#
g = GameManager()
g.callPower("00011", "0")
# fill our solution here
#solution = ["0000405226", "0010247315", "0010210257", "0010086746", "0010203880", "0010181421", "0010217966"]
solution = ["0010181421"]
g.getDevices(solution)
g.beginReading()

