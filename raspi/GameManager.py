# See: https://python-evdev.readthedocs.io/en/latest/tutorial.html
from subprocess import *
import evdev
from sys import *
from select import select
from evdev import InputDevice, categorize, ecodes
import glob
from os import listdir
from os.path import isfile, join
import asyncio


class GameManager:

    def __init__(self):
        # define here an variable for each usb reader we are using
        print("listening over usb...")
        # all connected readers are listed in /dev/input/by-path
        self.idealCombination = None
        self.readCombination = None
        self.selector = None
        self.currentDeviceName = None

        # TODO: write exception handling when vars are None after reading

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

        self.DEFF1 = InputDevice(self.devicesMatching[0])
        self.DEFF2 = InputDevice(self.devicesMatching[1])
        # for i in self.devices:
        #    i.grab()
        # This works because InputDevice has a `fileno()` method.
        """self.selector = selectors.DefaultSelector()
        for dev in self.devices:
            self.selector.register(dev, selectors.EVENT_READ)
        """

        self.devices = {dev.fd: dev for dev in self.devices}
        #self.devices2 = {dev.fd: dev for dev in self.devices2}

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
        # assert len(solution) == len(devices),  "length must be equal of solution provided and number of devices"

        keys = list(devices.keys())   # to have an index we can read from
        reader = [None] * len(devices)   # fill the reader object
        j = 0
        for i in keys:
            reader[j] = devices[i].phys
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
            "deviceName": reader,
            "value": readValues
        }

        return readCombination

    @staticmethod
    # return true if both objects have the same values
    def checkIfOkay(self, ideal, read):
        print("ideal: ")
        print(ideal)
        print("read: ")
        print(read)
        for key, _ in self.idealCombination.items():
            if self.idealCombination[key] != self.readCombination[key]:
                return False
        return True

    @staticmethod
    def writeToDictionary(key, value, readCombination):
        # get key where reader name is deviceName by iterating through the device and finding the index
        j = 0
        for i in readCombination["deviceName"]:
            #print(readCombination["deviceName"][j])
            if readCombination["deviceName"][j] == key:
                readCombination["value"][j] = value
                break
            else:
                j += 1

    """async def print_events(device):
        print(device)
        async for event in device.async_read_loop():
            print(device.path, evdev.categorize(event), sep=': ')
    """
    @classmethod
    def beginReading(self):
        # adapted from
        # http://domoticx.com/nfc-rfid-hardware-usb-stick-syc-idic-usb-reader/

        #print(self.devices)

        async def print_events(device):
            async for event in device.async_read_loop():
                if event.type == ecodes.EV_KEY:
                    print(categorize(event))
                    print(device.path, evdev.categorize(event), sep=': ')
                    # print(categorize(event))
                    readValue = str(input())  # raw_input
                    # enter into an endless read-loop
                    devicePhysName = device.phys
                    print(devicePhysName)
                    # print(event)
                    # print("Nachricht :" + str(event))
                    # if codeTag1 = event.code
                    self.writeToDictionary(
                        devicePhysName, readValue, self.readCombination)
                    # returns true if both data structures have equal values
                    result = self.checkIfOkay(
                        self, self.idealCombination, self.readCombination)
                    if result:
                        # Solution is found - Game over :)
                        print("Steckdose an!!")
                        break

        for device in self.DEFF1, self.DEFF2:
            print(device)
            asyncio.ensure_future(print_events(device))

        loop = asyncio.get_event_loop()
        loop.run_forever()

    """
            for fd in r:
                for event in self.devices[fd].read_loop():
                    #print("reading:... "+str(self.devices[fd]))
                    if event.type == ecodes.EV_KEY:
                        #print(categorize(event))
                        readValue = str(input())  # raw_input
                        # enter into an endless read-loop
                        devicePhysName = self.devices[fd].phys
                        print(devicePhysName)
                        # print(event)
                        # print("Nachricht :" + str(event))
                        # if codeTag1 = event.code
                        self.writeToDictionary(
                            fd, readValue, self.readCombination)
                        # returns true if both data structures have equal values
                        result = self.checkIfOkay(
                            self, self.idealCombination, self.readCombination)
                        if result:
                            # Solution is found - Game over :)
                            print("Steckdose an!!")
                            break

            for fd in r2:
                for event in self.devices2[fd].read_loop():
                    #print("reading:... "+str(self.devices2[fd]))
                    if event.type == ecodes.EV_KEY:
                        #print(categorize(event))
                        readValue = str(input())  # raw_input
                        # enter into an endless read-loop
                        #print(event)
                        devicePhysName = self.devices2[fd].phys
                        print(devicePhysName)
                        # print("Nachricht :" + str(event))
                        # if codeTag1 = event.code
                        self.writeToDictionary(
                            fd, readValue, self.readCombination)
                        # returns true if both data structures have equal values
                        result = self.checkIfOkay(
                            self, self.idealCombination, self.readCombination)
                        if result:
                            # Solution is found - Game over :)
                            print("Steckdose an!!")
                            break
    """

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
solution = ["0010210257", "0000405226"]
# solution = ["0010210257"]
g.getDevices(solution)
# g.getWolframOutput('Integrate[Log[x],x]')
g.beginReading()
