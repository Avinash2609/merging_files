#!.\myenv\Scripts\python
import pandas as pd
import sys
import time
import json
from io import StringIO 
dframes=[]
for p in sys.argv[1:]:
   try: 
        dframes.append(pd.read_csv(StringIO(p),sep=","))
   except:
        print("Unable to read a file no. ")

for df in dframes:
    df.columns=['id','marks']
    df.drop_duplicates(subset=['id'], keep='last',inplace=True)
    df.reset_index(inplace=True)
    df.drop("index",axis=1,inplace=True)
    df['marks'].fillna(value=0,inplace=True)

mydf=[]

for j in range(0,len(dframes)):
    for i in range(0,len(dframes[j])):
        try:
            dframes[j].loc[i,'marks']=int(dframes[j].loc[i,'marks'])
        except: 
             mydf.append(["File" + str(j+1),dframes[j].loc[i,'id'],dframes[j].loc[i,'marks']])
             dframes[j].drop(i,inplace=True)    
mydf=pd.DataFrame(mydf)
mydf.columns=['Filename','Roll No','Marks']
log="log"+ str(time.time()) +".csv"
# mydf.to_csv(log,mode='a',header=True,index=False)

dfs = [df.set_index(['id']) for df in dframes]
dfs = pd.concat(dfs, axis=1).reset_index()
dfs.fillna(value=0,inplace=True)   
result= "result"+ str(time.time()) +".csv"    
# first=dfs.to_csv(result,mode='a',header=True,index=False)

with pd.option_context('display.max_rows', None, 'display.max_columns', None):  # more options can be specified also
    print(dfs)
    
sys.stdout.flush()