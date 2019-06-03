# See: https://python-evdev.readthedocs.io/en/latest/tutorial.html
from subprocess import *
from sys import *
from select import select
from evdev import InputDevice


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

    # Fill devices (static amount right now)
    @classmethod
    def getDevices(self):
        self.dev1 = "/dev/input/by-path/platform-3f980000.usb-usb-0:1.2.3:1.0-event-kbd"
        self.dev2 = "/dev/input/by-path/platform-3f980000.usb-usb-0:1.2.4:1.0-event-kbd"

        # add devices here
        # TODO: handle expection when none are found
        self.devices = map(InputDevice, (self.dev1, self.dev2))
        self.devices = {dev.fd: dev for dev in self.devices}
        print(self.devices)

        self.idealCombination = self.initializeSolutionCombination()
        self.readCombination = self.initializeCombination()

    # initialize the correct pairs and to be read pairs
    # TODO: expand with parameters: number of readers and codes which are the
    # solution

    @classmethod
    def initializeSolutionCombination(cls):
        # init values which are the solution
        reader = ["usb-3f980000.usb-1.2.4/input0",
                  "usb-3f980000.usb-1.2.3/input0"]
        # the codes to unlock for each reader
        tagValues = ["0010210257", "0000405226"]
        idealCombination = {}

        # fill the dict
        for i in range(len(reader)):
            idealCombination[reader[i]] = tagValues[i]

            # read the dict
        print(idealCombination)
        for key, val in idealCombination.items():
            print(val)
            print(key)
            # print(idealCombination["platform-3f980000.usb-usb-0:1.2.3:1.0-event-kbd"])
        return idealCombination

    @classmethod
    def initializeCombination(cls):
        # init values to be read and filled out
        reader = ["usb-3f980000.usb-1.2.4/input0",
                  "usb-3f980000.usb-1.2.3/input0"]
        readValues = [None, None]  # the codes we will read

        readCombination = {}

        # fill the dict
        for i in range(len(reader)):
            readCombination[reader[i]] = readValues[i]

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
        for dev in self.devices.values():
            print(dev)
            # print(dev.capabilities(verbose=True))

        # adapted from
        # http://domoticx.com/nfc-rfid-hardware-usb-stick-syc-idic-usb-reader/
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


g = GameManager()
g.getDevices()
g.getWolframOutput('Integrate[Log[x],x]')
g.beginReading(g)
