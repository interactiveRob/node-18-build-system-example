# How to use
Duplicate this file and name it `env.json` 


# File contents

### non-https example


```json
    {
        "proxy": "http://mylocalsite.url",
        "https": false, 
    }
```


### local SSL cert example


```json
    {
        "proxy": "http://mylocalsite.url",
        "https": {
            "key": "/Users/me/dev/ssl/localhost-key.pem",
            "cert": "/Users/me/dev/ssl/localhost.pem"
        }
    }
```

