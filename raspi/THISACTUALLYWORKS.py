import asyncio
import evdev
# See: https://python-evdev.readthedocs.io/en/latest/tutorial.html
from subprocess import *
from sys import *
from select import select
from evdev import InputDevice, categorize, ecodes
import glob
from os import listdir
from os.path import isfile, join


devices = glob.glob("/dev/input/by-path/*")
devicesMatching = []

# find devices we need (keyboard rfid reader) from /dev/input
for device in devices:
        if 'usb' in device and 'event-kbd' in device:
            devicesMatching.append(device)

devicesMatching2 = devicesMatching[:1]
print(devicesMatching2)

devicesMatching = devicesMatching[1:]
print(devicesMatching)
    # add devices here
    # TODO: handle expection when none are found
devices = InputDevice(devicesMatching[0])
devices2 = InputDevice(devicesMatching2[0])
    # for i in self.devices:




async def print_events(device):
    async for event in device.async_read_loop():
         if event.type == ecodes.EV_KEY:
                    print(categorize(event))
                    print(device.path, evdev.categorize(event), sep=': ')
                    print()

for device in devices2, devices:
    print(device)
    asyncio.ensure_future(print_events(device))

loop = asyncio.get_event_loop()
loop.run_forever()
