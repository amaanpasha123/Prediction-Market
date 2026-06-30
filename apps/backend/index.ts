import  Express from "express";
import cors from "cors";
const app = Express();

app.use(Express.json());
app.use(cors());

app.post("/buy", middleware, (req, res)=>{
     
});

app.post("/sell",middleware, (req, res)=>{
    
});

app.post("/split",middleware, (req, res)=>{
    
});

app.post("/merge",middleware, (req, res)=>{
    
});

app.get("/balance",middleware, (req, res)=>{
    
})
app.get("/position", middleware, (req, res)=>{
    
})
app.get("/history", middleware, (req, res)=>{
    
})


app.listen(5000,()=> console.log("app is listening"));