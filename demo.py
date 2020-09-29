import sys
import pandas as pd
# from pandas import read_csv
# import json
# import requests

# url="http://localhost:3000/"
# r=requests.get(url)
# data=r.json

print("Hello worldsss")
df=pd.read_csv(sys.argv[1])
output = df.to_json()
print(output)
# print(df)
a=6
print(a)
sys.stdout.flush()