# See: https://python-evdev.readthedocs.io/en/latest/tutorial.html
from subprocess import *
from sys import *
from select import select
from evdev import InputDevice
import glob
from os import listdir
from os.path import isfile, join


class GameManager:

    def __init__(self):
        # define here an variable for each usb reader we are using
        print("listening over usb...")
        # all connected readers are listed in /dev/input/by-path
        self.dev1 = None
        self.dev2 = None

        self.idealCombination = None
        self.readCombination = None

        # TODO: write exception handling when vars are None after reading

    # Fill devices
    @classmethod
    def getDevices(self, solution):
        # register all found devices
        devices = glob.glob("/dev/input/by-path/*")
        devicesMatching = []

        # find devices we need (keyboard rfid reader) from /dev/input
        for device in devices:
            if 'usb' in device and 'event-kbd' in device:
                devicesMatching.append(device)

        # add devices here
        # TODO: handle expection when none are found
        self.devices = map(InputDevice, devicesMatching)
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
        assert len(solution) == len(devices)

        keys = list(devices.keys())   # to have an index we can read from
        reader = [None] * len(devices)   # fill the reader object
        j = 0
        for i in keys:
            reader[j] = devices[i].phys
            j += 1

        idealCombination = {
            "key": keys,
            "reader": reader,
            "value": solution  # passed solution dict
        }

        print(idealCombination)

        return idealCombination

    @classmethod
    def initializeCombination(cls, devices):
        # init values in dictionary to be read and filled out
        #print(devices[3].capabilities(verbose = True ))
        #print(devices[3].leds(verbose = True ))
        keys = list(devices.keys())   # to have an index we can read from
        reader = [None] * len(devices)   # fill the reader object
        j = 0
        for i in keys:
            reader[j] = devices[i].phys
            j += 1
        # the codes we will read of length of devices
        readValues = [None] * len(devices)

        readCombination = {}

        # fill the dict
        for i in range(len(reader)):
            readCombination[reader[i]] = readValues[i]

        readCombination = {
            "key": keys,
            "reader": reader,
            "value": readValues
        }

        print(readCombination)

        return readCombination

    @staticmethod
    # return true if both objects have the same values
    def checkIfOkay(self, ideal, read):
        print(ideal)
        print(read)
        for key, _ in self.idealCombination.items():
            if self.idealCombination[key] != self.readCombination[key]:
                return False
        return True

    @staticmethod
    def writeToDictionary(self, deviceName, val, dictionary):
        dictionary[deviceName] = val

    @staticmethod
    def beginReading(self):
        # adapted from
        # http://domoticx.com/nfc-rfid-hardware-usb-stick-syc-idic-usb-reader/
        for dev in self.devices.values():
            while True:
                r, _, _ = select(self.devices, [], [])
                for fd in r:
                    for event in self.devices[fd].read():  # fd needed?
                        readValue = str(input())  # raw_input
                        # enter into an endless read-loop
                        # if(event.code == 28):
                        devicePhysName = self.devices[fd].phys
                        print(event)
                        print("Nachricht :" + str(event))
                        # if codeTag1 = event.code
                        self.writeToDictionary(
                            devicePhysName, readValue, self.readCombination)
                        # returns true if both data structures have equal values
                        result = self.checkIfOkay(
                            self, self.idealCombination, self.readCombination)
                        if result:
                            # SOlution is found - Game over :)
                            print("Steckdose an!!")
                            break

    # follow other steps:
    # https://mathematica.stackexchange.com/questions/4643/how-to-use-mathematica-functions-in-python-programs
    # hacky way to call wolfram alpha from python
    @classmethod
    def getWolframOutput(cls, expression):
        #!/usr/bin/python
        command = '/usr/local/bin/runMath'
        parameter = expression
        call([command, parameter])


# UPDATE the SOLUTION we need!
g = GameManager()
# fill our solution here
# solution = ["0010210257", "0000405226"]
solution = ["0010210257"]
g.getDevices(solution)
# g.getWolframOutput('Integrate[Log[x],x]')
g.beginReading(g)
