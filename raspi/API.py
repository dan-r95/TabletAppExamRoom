import requests
import time


start = time.time()
appId= 'VE7UHH-AQU7235L74'
url = 'http://api.wolframalpha.com/v2/query?input=Equivalent[a%26%26(b||c))),a%26%26b||a%26%26c]// TautologyQ&format=plaintext&appid=' + appId
response = requests.get(url)
end = time.time()
print(response.text)
print(response.json)
print((end-start))
