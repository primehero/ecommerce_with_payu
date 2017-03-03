# pay-u
pay-u is a module which you can use only for creating orders(for now) to the Payumoney / Payubiz / Payu* servers. More functionality will be added but for now the following functions are usable.

### Usage 


``` javascript

    const payu = require("pay-u").newOrder,
          // for ease of usage we will be using express.
          app = require("express")();

    // Putting all our stuff in the root route.
    app.get("/", (req, res) => {
        payu.Create({            
		    amount: 2000,
		    productinfo: 'None',
		    firstname: 'Rj',
		    email: 'rjwork333@gmail.com',
		    phone: '9090909090',
		    surl: 'http://localhost:1337/success',
		    furl: 'http://localhost:1337/failure',
		    service_provider: 'payu_paisa'
	    },/* false === test payment*/ false);
	    
	    payu.sendReq()
	    .then(url => {
    	    res.redirect(url);
    	})
    	.catch(err => {
	    	res.send(err);
    	});
    });
    
    // Path to success :D, YAY!
    app.post("/success", (req, res) => {
        res.send("Success!")
    });
    
    // :P My payment failed!
    app.post("/failure", (req, res) => {
        res.send("OOPS payment failed!")
    });
    
    app.listen(1337, () => {
        console.log("Don't go to http://localhost:1337");
    });
    
```

### Tips
Incase you are creating a huge app and you will have code in a lot of directories and a lot files / url's / blah.. blah try using express and then do:
``` javascript
    // In the main application file
    app.locals.payu = require("pay-u");
    // Access data in all other files as
    req.app.locals.payu.*;
    
```
