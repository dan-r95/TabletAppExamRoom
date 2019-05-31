import evdev
from evdev  import InputDevice
from evdev import categorize, ecodes
from select import select

class GameNanager:

	# define here an variable for each usb reader we are using
	# all connected readers are listed in /dev/input/by-path
	dev1 = "/dev/input/by-path/platform-3f980000.usb-usb-0:1.2.3:1.0-event-kbd"
	dev2=  "/dev/input/by-path/platform-3f980000.usb-usb-0:1.2.4:1.0-event-kbd"


	print("listening over usb")


	# add devices here
	devices = map(InputDevice, (dev1, dev2))
	devices = {dev.fd: dev for dev in devices}


	container = []

	#for dev in devices.values(): 
	#	print(dev)
	#	print(dev.capabilities(verbose=True))

	# adapted from http://domoticx.com/nfc-rfid-hardware-usb-stick-syc-idic-usb-reader/
	while True:
	    r, w, x = select(devices, [], [])
	    for fd in r:
		for event in devices[fd].read():
		    # enter into an endeless read-loop
		    if(event.code == 28):
			print("Tag ausgelesen auf Reader :"+ str(devices[fd]))
			print("Nachricht :" + str(event) )
			
			
				
				
				
	""" if event.type == ecodes.EV_KEY and event.value == 1:
				
				if digit == 'KEY_ENTER':
				    # create and dump the tag
				    tag = "".join(i.strip('KEY_') for i in container)
				    print(tag)
				    container = []
				else:
				    container.append(digit)
		   #for event in device.read_loop():
			    
	 """
