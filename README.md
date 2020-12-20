## API for communication with twinfresh fan RW1-50 (V2.0)

It is not finished yet, but you are able to send and parse commands to the fans.
It has only been tested on RW1-50 fans.

### How to test
To test it you will have to change 3 variables inside the `fanConstant.ts` file
``` 
FAN_IP_ADDRESS
FAN_SERIAL
FAN_PASSWORD
```

Do not set these variables directly inside the file `fanConstant.ts` if you have plans to submit code to this repo.
Please create a file called `.env` and populate it with the following content, where you need to replace x y and z

```
FAN_IP_ADDRESS=xxx.xx.xx.xx
FAN_SERIAL=yyyyyyyyyyyyyyyy
FAN_PASSWORD=zzzz
```

### How to send signals
There are tests inside `fan.test.ts`, which will discover you fans and also let you send signal to them.



