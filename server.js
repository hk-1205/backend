const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const server = http.createServer((req, res) => {
    let { method } = req;

    if (method == "GET") {
        //get request handling
        if (req.url === "/") {
            console.log("inside / route and Get rquest");
            fs.readFile("User.json", "utf8", (err, data) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log(data);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(data);
                }
            });
        } else if (req.url == "/userdata") {
            fs.readFile("userdata.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log("sending userdata.html file");
                    res.end(data);
                }
            });
        } else if (req.url === "/index") {
            fs.readFile("Form/index.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    console.log("sending index.html file");
                    res.end(data);
                }
            });
        } else{
            //error handlings
            console.log(req.url);  
            res.writeHead(404);
            res.end("Not Found");
        }
    }




        // post method handling and // Store the user data in a file 
    else {
        if (req.url === "/index") {
            console.log("inside /index route and POST request");
            let body = "";
        
            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", ()=>{
                let readData = fs.readFileSync("User.json", "utf-8"); 
                console.log(readData); 
                if(!readData){
                    fs.writeFileSync("User.json", JSON.stringify([])); 
                }
                else{
                    let jsonData=JSON.parse(readData); 
                    let users = [...jsonData]; 

                    let convertedBody = qs.decode(body); 
                    users.push(convertedBody); 
                    console.log(users); 
                    fs.writeFile("User.json", JSON.stringify(users), (err)=>{
                        if(err){
                            console.log(err); 
                        } else{
                            console.log("User data inserted successfully"); 
                        }
                    });
                }
                fs.readFile("success.html", "utf8", (err, data) => {
                    if (err) {
                        console.log(err);
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("Server Error");
                    } else {
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(data);
                    }
                });
                

            });
              
            }
            else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not Found in POST request");
            }
        

    }
});

server.listen(3000,() => {
    console.log("Server listening on port 3000");
});
