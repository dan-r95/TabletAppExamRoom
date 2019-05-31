# See: https://python-evdev.readthedocs.io/en/latest/tutorial.html
import evdev
from evdev  import InputDevice
from evdev import categorize, ecodes
from select import select

#class GameManager:# define here an variable for each usb reader we are using
	
	


## initialize the correct pairs and to be read pairs
def initialize():
		
	# init values which are correct
	reader = ["usb-3f980000.usb-1.2.4/input0", "usb-3f980000.usb-1.2.3/input0"]
	tagValues = ["0010210257", "0000405226"]  # the codes to unlock for each reader
	idealCombination = {}
		
		# fill the dict
	for i in range(len(reader)):
		idealCombination[reader[i]] = tagValues[i]
		    
		# read the dict
	print(idealCombination)
	for key, val in idealCombination.items():
		print(val)
		print(key)
		#print(idealCombination["platform-3f980000.usb-usb-0:1.2.3:1.0-event-kbd"])
	return idealCombination
		
		
		# init values to be read
	reader = ["usb-3f980000.usb-1.2.4/input0", "usb-3f980000.usb-1.2.3/input0"]
	readValues = [None, None]  # the codes we have read
		
	readCombination = { }
			
		# fill the dict
	for i in range(len(reader)):
		readCombination[reader[i]] = readValues[i]
		
def checkIfOkay(ideal, read):
	print(ideal)
	print(read)
	for id, val in idealCombination.items():
		if idealCombination[id] != readCombination[id]:
			return False;
	return True;
				
def writeToDictionary(deviceName, val, dictionary):
	dictionary[deviceName] = val;
	
	
		
def beginReading():
	for dev in devices.values(): 
		print(dev)
		#print(dev.capabilities(verbose=True))

	# adapted from http://domoticx.com/nfc-rfid-hardware-usb-stick-syc-idic-usb-reader/
	while True:
		r, w, x = select(devices, [], [])
		for fd in r:
			for event in devices[fd].read():
				readValue = str(raw_input())
				# enter into an endeless read-loop
				#if(event.code == 28):
				devicePhysName = devices[fd].phys
				print(event)
				print("Nachricht :" + str(event))
				# if codeTag1 = event.code
				#  writeCodeTo readCombination
				writeToDictionary(devicePhysName, readValue, readCombination)
				result = checkIfOkay(idealCombination, readCombination)
				if result:
					print("Steckdose an!!")  
					break;
					
	# all connected readers are listed in /dev/input/by-path
dev1 = "/dev/input/by-path/platform-3f980000.usb-usb-0:1.2.3:1.0-event-kbd"
dev2=  "/dev/input/by-path/platform-3f980000.usb-usb-0:1.2.4:1.0-event-kbd"


print("listening over usb")


	# add devices here
global devices
devices = map(InputDevice, (dev1, dev2))
devices = {dev.fd: dev for dev in devices}
	
	
global idealCombination
global readCombination
	
idealCombination = initialize()
beginReading()
			
	
			
	
